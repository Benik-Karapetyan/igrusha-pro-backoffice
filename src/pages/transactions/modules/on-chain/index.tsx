import { useCallback, useEffect, useRef, useState } from "react";

import { FilterBar, OnChainTransactionDrawer, TableContainer } from "@containers";
import { OnChainTransactionFiltersForm, OnChainTransactionFiltersFormValues } from "@forms";
import { useAppMode } from "@hooks";
import { mdiMagnify } from "@mdi/js";
import { api } from "@services";
import { ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM } from "@types";
import { DataTable, Icon, RadioGroup, RadioGroupItem, TableFooter, TextField } from "@ui-kit";
import axios from "axios";
import { endOfDay } from "date-fns";
import { debounce, omit, startCase } from "lodash";

import { useOnChainTransactionFilters } from "./hooks/useOnChainTransactionFilters";
import { useOnChainTransactionHeaders } from "./hooks/useOnChainTransactionHeaders";

export const OnChain = () => {
  const { isWallet } = useAppMode();
  const { headers } = useOnChainTransactionHeaders();
  const {
    filters,
    setFilters,
    filtersCount,
    loading: filtersLoading,
    serverError,
    networks,
    coins,
    fetchFilterOptions,
  } = useOnChainTransactionFilters();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    filters: {
      types: [],
      network: [],
      assetSymbols: [],
      status: [],
      riskLevel: [],
      creationDate: [],
    } as OnChainTransactionFiltersFormValues,
    searchCriteria: [
      {
        searchTerm: ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.CustomerId,
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

  const handleSearchTermChange = (searchTerm: ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM) =>
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
    (onChainTransactionFilters: OnChainTransactionFiltersFormValues) => {
      setFilters(onChainTransactionFilters);
      setParams((prev) => ({ ...prev, page: 1, filters: { ...onChainTransactionFilters } }));
      canFetch.current = true;
    },
    [setFilters]
  );

  const getOnChainTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = isWallet
        ? await axios.get(`${import.meta.env.VITE_WALLET_SERVICE_URL}/transactionMonitoring`, {
            params: {
              ...params,
              filters: {
                ...omit(params.filters, "creationDate"),
                ...(params.filters.creationDate.length === 2
                  ? {
                      createdFrom: new Date(params.filters.creationDate[0]),
                      createdTo: endOfDay(params.filters.creationDate[1]),
                    }
                  : {}),
              },
            },
          })
        : await api.post("/trx/api/transactionMonitoring/transactions", {
            ...params,
            filters: {
              ...omit(params.filters, "creationDate"),
              ...(params.filters.creationDate.length === 2
                ? {
                    createdFrom: new Date(params.filters.creationDate[0]),
                    createdTo: endOfDay(params.filters.creationDate[1]),
                  }
                : {}),
            },
          });

      setItems(isWallet ? data.data.items : data.items);
      setTotalPages(isWallet ? data.data.totalPages : data.totalPages);
      setTotalRecords(isWallet ? data.data.totalRecords : data.totalRecords);
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
    if (canFetch.current) {
      canFetch.current = false;
      void getOnChainTransactions();
    }
  }, [getOnChainTransactions]);

  return (
    <>
      <div className="flex items-center justify-between gap-5 border-b px-5 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div>Search By:</div>

            <RadioGroup
              defaultValue={params.searchCriteria[0].searchTerm}
              onValueChange={handleSearchTermChange}
              className="flex flex-row"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id={ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.CustomerId}
                  value={ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.CustomerId}
                />
                <label
                  htmlFor={ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.CustomerId}
                  className="cursor-pointer select-none text-sm font-semibold text-foreground-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                >
                  Customer Id
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id={ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.TransactionId}
                  value={ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.TransactionId}
                />
                <label
                  htmlFor={ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.TransactionId}
                  className="cursor-pointer select-none text-sm font-semibold text-foreground-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                >
                  Transaction Id
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  id={ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.TransactionHash}
                  value={ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.TransactionHash}
                />
                <label
                  htmlFor={ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.TransactionHash}
                  className="cursor-pointer select-none text-sm font-semibold text-foreground-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                >
                  Transaction Hash
                </label>
              </div>
            </RadioGroup>
          </div>

          <TextField
            value={searchValue}
            placeholder={startCase(params.searchCriteria[0].searchTerm)}
            hideDetails
            prependInner={<Icon name={mdiMagnify} className="mr-2" />}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <FilterBar
          filtersCount={filtersCount}
          loading={filtersLoading}
          serverError={serverError}
          onFilterBtnClick={fetchFilterOptions}
        >
          <OnChainTransactionFiltersForm filters={filters} networks={networks} coins={coins} onFilter={handleFilter} />
        </FilterBar>
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

      <OnChainTransactionDrawer />
    </>
  );
};
