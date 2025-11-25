import { useCallback, useEffect, useRef, useState } from "react";

import {
  AdminUserRolesDialog,
  AppToolbar,
  DeleteDialog,
  FilterBar,
  ResetPasswordDialog,
  StatusDialog,
  TableContainer,
} from "@containers";
import { AdminUserFiltersForm, AdminUserFiltersFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useNavigate } from "@tanstack/react-router";
import { FilterItem, RangeItem } from "@types";
import { DataTable, TableFooter, TableItem } from "@ui-kit";
import { debounce } from "lodash";

import { useAdminUserFilters } from "./hooks/useAdminUserFilters";
import { useAdminUserHeaders } from "./hooks/useAdminUserHeaders";

export const AdminUsersPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useAdminUserHeaders();
  const {
    filters,
    loading: filtersLoading,
    serverError,
    roles,
    orgLevels,
    brands,
    fetchFilterOptions,
    mapFilters,
  } = useAdminUserFilters();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    orders: [{ column: 1, isDescending: true }],
    filters: [] as FilterItem[],
    ranges: [] as RangeItem[],
    searchTerm: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const debouncedSearchTermChange = useRef(
    debounce((searchTerm: string) => {
      setParams((prev) => ({ ...prev, searchTerm }));
      canFetch.current = true;
    }, 500)
  ).current;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearchTermChange(value);
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleFilter = useCallback(
    (adminUserFilters: AdminUserFiltersFormValues) => {
      const { filters, ranges } = mapFilters(adminUserFilters);
      setParams((prev) => ({ ...prev, filters, ranges }));
      canFetch.current = true;
    },
    [mapFilters]
  );

  const handleAddClick = () => {
    navigate({ to: "/admin-users/admin-user" });
  };

  const getAdminUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/bo/api/users/all", params);
      data.items.forEach((item: TableItem) => {
        item.fullName = `${item.firstName || "-"} ${item.lastName || "-"}`;
      });
      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!checkPermission("admin_user_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getAdminUsers();
    }
  }, [checkPermission, navigate, getAdminUsers]);

  return (
    <div>
      <AppToolbar
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        hasCreatePermission={checkPermission("admin_user_create")}
        btnText="Add Admin User"
        onAddClick={handleAddClick}
      />

      <FilterBar
        filtersCount={params.filters.length + params.ranges.length}
        loading={filtersLoading}
        serverError={serverError}
        onFilterBtnClick={fetchFilterOptions}
      >
        <AdminUserFiltersForm
          filters={filters}
          roles={roles}
          orgLevels={orgLevels}
          brands={brands}
          onFilter={handleFilter}
        />
      </FilterBar>

      <TableContainer>
        <div className="overflow-auto">
          <DataTable headers={headers} items={items} loading={loading} hideFooter />
        </div>

        <table className="w-full">
          <TableFooter
            headersLength={headers.length}
            page={params.page}
            onPageChange={handlePageChange}
            itemsPerPage={params.pageSize}
            onItemsPerPageChange={handlePerPageChange}
            pageCount={totalPages}
            itemsTotalCount={totalRecords}
          />
        </table>
      </TableContainer>

      <AdminUserRolesDialog />
      <StatusDialog title="Admin User" updateUrl="users" onSuccess={getAdminUsers} />
      <ResetPasswordDialog />
      <DeleteDialog title="Admin User" deleteUrl="users" onSuccess={getAdminUsers} />
    </div>
  );
};
