import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { emptyOnChainTransactionFilters } from "@forms";
import { api } from "@services";
import { ISelectItem } from "@types";

export const useOnChainTransactionFilters = () => {
  const [filters, setFilters] = useState(emptyOnChainTransactionFilters);
  const canFetch = useRef(true);
  const [allowOptionsFetch, setAllowOptionsFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    networks: [] as ISelectItem[],
    coins: [] as ISelectItem[],
  });

  const filtersCount = useMemo(() => {
    let count = 0;

    for (const key in filters) {
      if (filters[key as keyof typeof filters].length) {
        count++;
      }
    }

    return count;
  }, [filters]);

  const fetchFilterOptions = () => setAllowOptionsFetch(true);

  const getOnChainTransactionFilters = useCallback(async () => {
    try {
      setLoading(true);

      const { data: coinsData } = await api.get("/bo/api/coins/all?page=1&pageSize=10000");
      setFilterOptions((prev) => ({
        ...prev,
        coins: coinsData.items
          .filter((item: { status: number }) => item.status === 1)
          .map((item: { symbol: string }) => ({
            ...item,
            id: item.symbol,
          })),
      }));
      const { data: networksData } = await api.get("/bo/api/networks/all?page=1&pageSize=10000");
      setFilterOptions((prev) => ({
        ...prev,
        networks: networksData
          .filter((item: { status: number }) => item.status === 1)
          .map((item: { id: number }) => ({
            ...item,
            id: String(item.id),
          })),
      }));
    } catch (err) {
      setServerError(!!err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allowOptionsFetch && canFetch.current) {
      canFetch.current = false;
      void getOnChainTransactionFilters();
    }
  }, [allowOptionsFetch, getOnChainTransactionFilters]);

  return {
    filters,
    setFilters,
    filtersCount,
    loading,
    serverError,
    ...filterOptions,
    fetchFilterOptions,
  };
};
