import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { emptyOnOffRampHistoryFilters } from "@forms";
import { api } from "@services";
import { ISelectItem } from "@types";

export const useOnOffRampHistoryFilters = () => {
  const [filters, setFilters] = useState(emptyOnOffRampHistoryFilters);
  const canFetch = useRef(true);
  const [allowOptionsFetch, setAllowOptionsFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    coins: [] as ISelectItem[],
  });

  const filtersCount = useMemo(() => {
    const nonDateCount = Object.entries(filters).reduce((acc, [key, value]) => {
      if (key === "createdAt") return acc;
      return acc + (typeof value === "number" && value !== 0 ? 1 : 0);
    }, 0);

    const createdAtCount = filters.createdAt.length === 2 ? 1 : 0;

    return nonDateCount + createdAtCount;
  }, [filters]);

  const fetchFilterOptions = () => setAllowOptionsFetch(true);

  const getCoins = useCallback(async () => {
    try {
      canFetch.current = false;
      setLoading(true);

      const { data } = await api.get("/bo/api/coins/all?page=1&pageSize=10000");
      setFilterOptions({ coins: data.items.filter((item: { status: number }) => item.status === 1) });
    } catch (err) {
      setServerError(!!err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allowOptionsFetch && canFetch.current) {
      void getCoins();
    }
  }, [allowOptionsFetch, getCoins]);

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
