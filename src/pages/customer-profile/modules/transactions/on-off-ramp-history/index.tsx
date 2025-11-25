import { useCallback, useEffect, useRef, useState } from "react";

import { FilterBar, OnOffRampTransactionDrawer, TableContainer } from "@containers";
import { OnOffRampHistoryFiltersForm, OnOffRampHistoryFiltersFormValues } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { DataTable, Icon, TableFooter, TextField } from "@ui-kit";
import { searchIcon } from "@utils";
import { endOfDay } from "date-fns";
import { debounce, omit } from "lodash";

import { useOnOffRampHistoryFilters } from "./hooks/useOnOffRampHistoryFilters";
import { useOnOffRampHistoryHeaders } from "./hooks/useOnOffRampHistoryHeaders";

export const OnOffRampHistory = () => {
  const customerMainInfo = useStore((s) => s.customerMainInfo);
  const { headers } = useOnOffRampHistoryHeaders();
  const {
    filters,
    setFilters,
    filtersCount,
    loading: filtersLoading,
    serverError,
    coins,
    fetchFilterOptions,
  } = useOnOffRampHistoryFilters();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    userId: customerMainInfo?.id,
    filters: {
      transactionType: 0,
      status: 0,
      currency: 0,
      paymentProviderId: 0,
      createdAt: [],
    } as OnOffRampHistoryFiltersFormValues,
    orderId: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const debouncedSearchTermChange = useRef(
    debounce((value: string) => {
      setParams((prev) => ({ ...prev, orderId: value }));
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
    (onOffRampHistoryFilters: OnOffRampHistoryFiltersFormValues) => {
      setFilters(onOffRampHistoryFilters);
      setParams((prev) => ({ ...prev, page: 1, filters: { ...onOffRampHistoryFilters } }));
      canFetch.current = true;
    },
    [setFilters]
  );

  const getOnOffRampHistory = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/payment/orders-history", {
        params: {
          ...omit(params, "filters", "orderId"),
          ...Object.entries(omit(params.filters, "createdAt")).reduce(
            (acc, [key, value]) => {
              if (typeof value === "number" && value !== 0) {
                acc[key] = value;
              }
              return acc;
            },
            {} as Record<string, number>
          ),
          ...(params.filters.createdAt.length === 2
            ? { dateFrom: params.filters.createdAt[0], dateTo: endOfDay(params.filters.createdAt[1]) }
            : {}),
          ...(params.orderId ? { orderId: params.orderId } : {}),
        },
      });

      setItems(data.data.items);
      setTotalPages(data.data.totalPages);
      setTotalRecords(data.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getOnOffRampHistory();
    }
  }, [getOnOffRampHistory]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex w-[240px] flex-col gap-3">
          <TextField
            value={searchValue}
            placeholder="Search by Order ID"
            hideDetails
            prependInner={<Icon name={searchIcon} className="mr-2" />}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <FilterBar
          filtersCount={filtersCount}
          loading={filtersLoading}
          serverError={serverError}
          onFilterBtnClick={fetchFilterOptions}
        >
          <OnOffRampHistoryFiltersForm filters={filters} coins={coins} onFilter={handleFilter} />
        </FilterBar>
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

      <OnOffRampTransactionDrawer />
    </div>
  );
};
