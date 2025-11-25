import { useCallback, useEffect, useRef, useState } from "react";

import { AppToolbar, DeleteDialog, FilterBar, StatusDialog, TableContainer } from "@containers";
import { RoleFiltersForm, RoleFiltersFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useNavigate } from "@tanstack/react-router";
import { FilterItem, RangeItem } from "@types";
import { DataTable, TableFooter } from "@ui-kit";
import { debounce } from "lodash";

import { useRoleFilters } from "./hooks/useRoleFilters";
import { useRoleHeaders } from "./hooks/useRoleHeaders";

export const RolesPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useRoleHeaders();
  const {
    filters,
    loading: filtersLoading,
    serverError,
    modifiedByItems,
    fetchFilterOptions,
    mapFilters,
  } = useRoleFilters();
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
    (roleFilters: RoleFiltersFormValues) => {
      const { filters, ranges } = mapFilters(roleFilters);
      setParams((prev) => ({ ...prev, filters, ranges }));
      canFetch.current = true;
    },
    [mapFilters]
  );

  const handleAddClick = () => {
    navigate({ to: "/roles/role" });
  };

  const getRoles = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/bo/api/roles/all", params);
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
    if (!checkPermission("roles_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getRoles();
    }
  }, [checkPermission, navigate, getRoles]);

  return (
    <div>
      <AppToolbar
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        hasCreatePermission={checkPermission("roles_create")}
        btnText="Add Role"
        onAddClick={handleAddClick}
      />

      <FilterBar
        filtersCount={params.filters.length + params.ranges.length}
        loading={filtersLoading}
        serverError={serverError}
        onFilterBtnClick={fetchFilterOptions}
      >
        <RoleFiltersForm filters={filters} modifiedByItems={modifiedByItems} onFilter={handleFilter} />
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

      <StatusDialog title="Role" updateUrl="roles" onSuccess={getRoles} />
      <DeleteDialog title="Role" deleteUrl="roles" onSuccess={getRoles} />
    </div>
  );
};
