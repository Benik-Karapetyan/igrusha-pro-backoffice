import { useCallback, useEffect, useRef, useState } from "react";

import { FilterBar, TableContainer, TradingHistoryToolbar } from "@containers";
import { TradingHistoryFiltersForm, TradingHistoryFiltersFormValues } from "@forms";
import { api } from "@services";
import { ENUM_TRADING_HISTORY_SEARCH_TERM } from "@types";
import { DataTable, TableFooter } from "@ui-kit";
import { endOfDay } from "date-fns";
import { debounce, omit } from "lodash";

import { useTradingHistoryFilters } from "./hooks/useTradingHistoryFilters";
import { useTradingHistoryHeaders } from "./hooks/useTradingHistoryHeaders";

export const TradingHistoryPage = () => {
  const { headers } = useTradingHistoryHeaders();
  const {
    filters,
    setFilters,
    filtersCount,
    loading: filtersLoading,
    serverError,
    tradingPairs,
    fetchFilterOptions,
  } = useTradingHistoryFilters();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    filters: {
      marketSymbolPairs: [],
      createdAt: [],
    } as TradingHistoryFiltersFormValues,
    searchCriteria: [
      {
        searchTerm: ENUM_TRADING_HISTORY_SEARCH_TERM.CustomerId,
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

  const handleSearchTermChange = (searchTerm: ENUM_TRADING_HISTORY_SEARCH_TERM) =>
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
    (tradingHistoryFilters: TradingHistoryFiltersFormValues) => {
      setFilters(tradingHistoryFilters);
      setParams((prev) => ({ ...prev, page: 1, filters: { ...tradingHistoryFilters } }));
      canFetch.current = true;
    },
    [setFilters]
  );

  const getTradingHistory = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/trx/api/transactionMonitoring/trades", {
        ...omit(params, "searchCriteria"),
        filters: {
          ...omit(params.filters, "createdAt"),
          createdFrom: params.filters.createdAt[0],
          createdTo: endOfDay(params.filters.createdAt[1]),
          [params.searchCriteria[0].searchTerm]: params.searchCriteria[0].value
            ? [
                params.searchCriteria[0].searchTerm === ENUM_TRADING_HISTORY_SEARCH_TERM.OrderId
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
      void getTradingHistory();
    }
  }, [getTradingHistory]);

  return (
    <div>
      <TradingHistoryToolbar
        searchTerm={params.searchCriteria[0].searchTerm}
        onSearchTermChange={handleSearchTermChange}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onRefetchClick={getTradingHistory}
      />

      <FilterBar
        filtersCount={filtersCount}
        loading={filtersLoading}
        serverError={serverError}
        onFilterBtnClick={fetchFilterOptions}
      >
        <TradingHistoryFiltersForm filters={filters} tradingPairs={tradingPairs} onFilter={handleFilter} />
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
    </div>
  );
};
