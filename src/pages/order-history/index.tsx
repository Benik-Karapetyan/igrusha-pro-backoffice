import { useCallback, useEffect, useRef, useState } from "react";

import { FilterBar, OrderHistoryToolbar, TableContainer } from "@containers";
import { OrderHistoryFiltersForm, OrderHistoryFiltersFormValues } from "@forms";
import { api } from "@services";
import { ENUM_ORDER_HISTORY_SEARCH_TERM } from "@types";
import { DataTable, TableFooter } from "@ui-kit";
import { endOfDay } from "date-fns";
import { debounce, omit } from "lodash";

import { ExpandContent } from "./expand-content";
import { useOrderHistoryFilters } from "./hooks/useOrderHistoryFilters";
import { useOrderHistoryHeaders } from "./hooks/useOrderHistoryHeaders";

export const OrderHistoryPage = () => {
  const { headers } = useOrderHistoryHeaders();
  const {
    filters,
    setFilters,
    filtersCount,
    loading: filtersLoading,
    serverError,
    tradingPairs,
    fetchFilterOptions,
  } = useOrderHistoryFilters();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    filters: {
      status: "",
      types: [],
      marketSymbolPairs: [],
      sides: [],
      createdAt: [],
    } as OrderHistoryFiltersFormValues,
    searchCriteria: [
      {
        searchTerm: ENUM_ORDER_HISTORY_SEARCH_TERM.CustomerId,
        value: "",
      },
    ],
  });
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [expandedRow, setExpandedRow] = useState<number>();

  const handleExpand = (index: number) => {
    setExpandedRow(index === expandedRow ? undefined : index);
  };

  const handleSearchTermChange = (searchTerm: ENUM_ORDER_HISTORY_SEARCH_TERM) =>
    setParams((prev) => ({ ...prev, searchCriteria: [{ ...prev.searchCriteria[0], searchTerm }] }));

  const debouncedSearchTermChange = useRef(
    debounce((value: string) => {
      setParams((prev) => ({ ...prev, page: 1, searchCriteria: [{ ...prev.searchCriteria[0], value }] }));
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
    (orderHistoryFilters: OrderHistoryFiltersFormValues) => {
      setFilters(orderHistoryFilters);
      setParams((prev) => ({ ...prev, page: 1, filters: { ...orderHistoryFilters } }));
      canFetch.current = true;
    },
    [setFilters]
  );

  const getOrderHistory = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/trx/api/transactionMonitoring/orders", {
        ...omit(params, "searchCriteria"),
        filters: {
          ...omit(params.filters, "createdAt", !params.filters.status ? "status" : ""),
          createdFrom: params.filters.createdAt[0],
          createdTo: endOfDay(params.filters.createdAt[1]),
          [params.searchCriteria[0].searchTerm]: params.searchCriteria[0].value
            ? [
                params.searchCriteria[0].searchTerm === ENUM_ORDER_HISTORY_SEARCH_TERM.OrderId
                  ? Number(params.searchCriteria[0].value)
                  : params.searchCriteria[0].value,
              ]
            : undefined,
        },
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
    if (canFetch.current) {
      canFetch.current = false;
      void getOrderHistory();
    }
  }, [getOrderHistory]);

  return (
    <div>
      <OrderHistoryToolbar
        searchTerm={params.searchCriteria[0].searchTerm}
        onSearchTermChange={handleSearchTermChange}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onRefetchClick={getOrderHistory}
      />

      <FilterBar
        filtersCount={filtersCount}
        loading={filtersLoading}
        serverError={serverError}
        onFilterBtnClick={fetchFilterOptions}
      >
        <OrderHistoryFiltersForm filters={filters} tradingPairs={tradingPairs} onFilter={handleFilter} />
      </FilterBar>

      <TableContainer>
        <div className="overflow-auto">
          <DataTable
            headers={headers}
            items={items}
            loading={loading}
            expandable
            expandContent={
              <ExpandContent
                orderId={typeof expandedRow === "number" ? (items[expandedRow] as { id: number }).id : undefined}
              />
            }
            expandedRow={expandedRow}
            onExpand={handleExpand}
            hideFooter
          />
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
