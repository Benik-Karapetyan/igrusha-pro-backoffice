import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { AppHeader, FilterBar, TableContainer } from "@containers";
import { CustomerFiltersForm, CustomerFiltersFormValues } from "@forms";
import { useCheckPermission, useExportToCSV, useToast } from "@hooks";
import { useAppMode } from "@hooks";
import { api } from "@services";
import { useNavigate } from "@tanstack/react-router";
import { FilterItem, RangeItem } from "@types";
import { Button, DataTable, Icon, TableFooter, TextField } from "@ui-kit";
import { getErrorMessage, searchIcon } from "@utils";
import axios from "axios";
import { debounce } from "lodash";

import { useCustomerFilters } from "./hooks/useCustomerFilters";
import { useCustomerHeaders } from "./hooks/useCustomerHeaders";

export const CustomersPage = () => {
  const { isWallet } = useAppMode();
  const toast = useToast();
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { exportToCSV } = useExportToCSV();
  const { headers } = useCustomerHeaders();
  const {
    filters,
    loading: filtersLoading,
    serverError,
    kycCountries,
    levels,
    lastLoginCountries,
    fetchFilterOptions,
    mapFilters,
  } = useCustomerFilters();
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

  const handleSearchChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
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
    (customerFilters: CustomerFiltersFormValues) => {
      const { filters, ranges } = mapFilters(customerFilters);
      setParams((prev) => ({ ...prev, filters, ranges }));
      canFetch.current = true;
    },
    [mapFilters]
  );

  const handleExport = async () => {
    try {
      const { data } = await api.post("/bo/api/customers/export", params);
      const exported = await exportToCSV(data, "customers");
      if (exported) toast.success("Customers successfully exported!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const getCustomers = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = isWallet
        ? await axios.post(`${import.meta.env.VITE_WALLET_SERVICE_URL}/customers/all`, params)
        : await api.post(`/bo/api/customers/all`, params);
      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params, isWallet]);

  useEffect(() => {
    canFetch.current = true;
  }, [isWallet]);

  useEffect(() => {
    if (!checkPermission("customer_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getCustomers();
    }
  }, [checkPermission, navigate, getCustomers]);

  return (
    <div>
      <AppHeader title="Customers" />

      <div className="flex items-center justify-between p-4 pb-0">
        <TextField
          value={searchValue}
          placeholder="Search by UID, Full Name, Email"
          className="w-[222px]"
          hideDetails
          prependInner={<Icon name={searchIcon} className="mr-2" />}
          onChange={handleSearchChange}
        />

        <div className="flex items-center gap-4">
          {checkPermission("customer_export") && (
            <Button variant="text" onClick={handleExport}>
              Export CSV
            </Button>
          )}

          <FilterBar
            filtersCount={params.filters.length + params.ranges.length}
            loading={filtersLoading}
            serverError={serverError}
            onFilterBtnClick={fetchFilterOptions}
          >
            <CustomerFiltersForm
              filters={filters}
              kycCountries={kycCountries}
              levels={levels}
              lastLoginCountries={lastLoginCountries}
              onFilter={handleFilter}
            />
          </FilterBar>
        </div>
      </div>

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
    </div>
  );
};
