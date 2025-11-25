import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { FilterBar, TableContainer, TransactionAlertsDrawer } from "@containers";
import {
  AlertCenterOnChainTransactionFiltersForm,
  AlertCenterOnChainTransactionFiltersFormValues,
  emptyAlertCenterOnChainTransactionFilters,
} from "@forms";
import { useExportToCSV } from "@hooks";
import { api } from "@services";
import { Button, DataTable, Icon, TableFooter, TextField } from "@ui-kit";
import { getErrorMessage, searchIcon } from "@utils";
import { debounce, isEmpty, isObject, omit, pickBy } from "lodash";
import { toast } from "sonner";

import { useTransactionHeaders } from "./hooks/useTransactionHeaders";

export const Transactions = () => {
  const { exportToCSV } = useExportToCSV();
  const { headers } = useTransactionHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    searchTerm: "",
    filters: emptyAlertCenterOnChainTransactionFilters,
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
    (alertCenterOnChainTransactionFilters: AlertCenterOnChainTransactionFiltersFormValues) => {
      setParams((prev) => ({ ...prev, filters: alertCenterOnChainTransactionFilters }));
      canFetch.current = true;
    },
    []
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

  const getTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/alerts/api/transactions", {
        params: {
          ...omit(params, "filters"),
          ...pickBy(omit(params.filters, "transactionDate"), (v) => {
            if (!v) return false;
            if (Array.isArray(v) && v.length === 0) return false;
            if (isObject(v) && isEmpty(v)) return false;
            return true;
          }),
          ...(params.filters.transactionDate.length === 2
            ? {
                startDate: new Date(params.filters.transactionDate[0]),
                endDate: new Date(params.filters.transactionDate[1]),
              }
            : {}),
        },
      });

      setItems(data.data);
      setTotalPages(data.meta.totalPages);
      setTotalRecords(data.meta.totalItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getTransactions();
    }
  }, [getTransactions]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="w-[250px]">
          <TextField
            value={searchValue}
            placeholder="Transaction ID, Customer ID"
            hideDetails
            prependInner={<Icon name={searchIcon} className="mr-2" />}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button variant="text" onClick={handleExport}>
            Export CSV
          </Button>

          <FilterBar
            filtersCount={
              Object.keys(
                pickBy(params.filters, (v) => {
                  if (!v) return false;
                  if (Array.isArray(v) && v.length === 0) return false;
                  if (isObject(v) && isEmpty(v)) return false;
                  return true;
                })
              ).length
            }
            onFilterBtnClick={() => {}}
          >
            <AlertCenterOnChainTransactionFiltersForm filters={params.filters} onFilter={handleFilter} />
          </FilterBar>
        </div>
      </div>

      <div className="-m-4">
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

      <TransactionAlertsDrawer onSuccess={getTransactions} />
    </div>
  );
};
