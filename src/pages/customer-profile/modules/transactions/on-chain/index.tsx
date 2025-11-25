import { useCallback, useEffect, useRef, useState } from "react";

import { FilterBar, OnChainTransactionDrawer, TableContainer } from "@containers";
import { OnChainTransactionFiltersForm, OnChainTransactionFiltersFormValues } from "@forms";
import { useAppMode } from "@hooks";
import { api } from "@services";
import { useParams } from "@tanstack/react-router";
import { ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM } from "@types";
import { DataTable, Icon, TableFooter, TextField } from "@ui-kit";
import { searchIcon } from "@utils";
import axios from "axios";
import { endOfDay } from "date-fns";
import { debounce, omit } from "lodash";

import { useOnChainTransactionFilters } from "./hooks/useOnChainTransactionFilters.tsx";
import { useOnChainTransactionHeaders } from "./hooks/useOnChainTransactionHeaders.tsx.tsx";

export const OnChain = () => {
  const { isWallet } = useAppMode();
  const { id } = useParams({ from: "/auth/customers/$id" });
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
        searchTerm: `${ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.TransactionId}|${ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM.TransactionHash}`,
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
        ? await axios.get(
            `${import.meta.env.VITE_WALLET_SERVICE_URL}/transactionMonitoring/customers/${id}/transactions`,
            {
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
            }
          )
        : await api.post(`/trx/api/transactionMonitoring/customers/${id}/transactions`, {
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

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, params, isWallet]);

  useEffect(() => {
    canFetch.current = true;
  }, [isWallet]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getOnChainTransactions();
    }
  }, [canFetch, getOnChainTransactions]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-5">
        <div className="flex w-[380px] flex-col gap-3">
          <TextField
            value={searchValue}
            placeholder="Search by Transaction Id or Transaction Hash"
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
          <OnChainTransactionFiltersForm filters={filters} networks={networks} coins={coins} onFilter={handleFilter} />
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

      <OnChainTransactionDrawer />
    </div>
  );
};
