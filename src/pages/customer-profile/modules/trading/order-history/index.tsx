import { useCallback, useEffect, useRef, useState } from "react";

import { FilterBar, TableContainer } from "@containers";
import { OrderHistoryFiltersForm, OrderHistoryFiltersFormValues } from "@forms";
import { TTradingTabValue } from "@routes";
import { api } from "@services";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { ENUM_ORDER_HISTORY_SEARCH_TERM } from "@types";
import { DataTable, RadioGroup, RadioGroupItem, TableFooter } from "@ui-kit";
import { TextField } from "@ui-kit";
import { Icon } from "@ui-kit";
import { searchIcon } from "@utils";
import { endOfDay } from "date-fns";
import { debounce, omit } from "lodash";

import { ExpandContent } from "./expand-content";
import { useOrderHistoryFilters } from "./hooks/useOrderHistoryFilters";
import { useOrderHistoryHeaders } from "./hooks/useOrderHistoryHeaders";

export const OrderHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/auth/customers/$id" });
  const { tab, tradingTab } = useSearch({ from: "/auth/customers/$id" });
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
        searchTerm: ENUM_ORDER_HISTORY_SEARCH_TERM.OrderId,
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

  const handleTabClick = (value: TTradingTabValue) => {
    void navigate({
      to: "/customers/$id",
      params: { id: String(id) },
      search: { tab, tradingTab: value },
    });
  };

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

      const { data } = await api.post(`/trx/api/transactionMonitoring/customers/${id}/orders`, {
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
  }, [id, params]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getOrderHistory();
    }
  }, [getOrderHistory]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <RadioGroup
            defaultValue={tradingTab || "orderHistory"}
            onValueChange={(val) => handleTabClick(val as TTradingTabValue)}
            className="flex flex-row"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="orderHistory" value="orderHistory" />
              <label
                htmlFor="orderHistory"
                className="cursor-pointer select-none text-sm font-semibold text-foreground-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
              >
                Order History
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="tradingHistory" value="tradingHistory" />
              <label
                htmlFor="tradingHistory"
                className="cursor-pointer select-none text-sm font-semibold text-foreground-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
              >
                Trading History
              </label>
            </div>
          </RadioGroup>

          <div className="h-5 w-[1px] bg-stroke-default" />

          <TextField
            value={searchValue}
            placeholder="Search by Order ID"
            type="number"
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
          <OrderHistoryFiltersForm filters={filters} tradingPairs={tradingPairs} onFilter={handleFilter} />
        </FilterBar>
      </div>

      <div className="-m-4">
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
    </div>
  );
};
