import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { emptyOrderHistoryFilters } from "@forms";
import { api } from "@services";
import { ISelectItem } from "@types";

export const useOrderHistoryFilters = () => {
  const [filters, setFilters] = useState(emptyOrderHistoryFilters);
  const canFetch = useRef(true);
  const [allowOptionsFetch, setAllowOptionsFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    tradingPairs: [] as ISelectItem[],
  });

  const filtersCount = useMemo(() => {
    const count =
      Object.keys(filters.types).length +
      Object.keys(filters.marketSymbolPairs).length +
      Object.keys(filters.sides).length +
      filters.createdAt.length
        ? 1
        : 0;

    return filters.status ? count + 1 : count;
  }, [filters]);

  const fetchFilterOptions = () => setAllowOptionsFetch(true);

  const getSpotTradingPairs = useCallback(async () => {
    try {
      canFetch.current = false;
      setLoading(true);

      const { data } = await api.get("/bo/api/markets/all?page=1&pageSize=10000");
      setFilterOptions({ tradingPairs: data.data.items.map((item: ISelectItem) => ({ ...item, id: item.name })) });
    } catch (err) {
      setServerError(!!err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allowOptionsFetch && canFetch.current) {
      void getSpotTradingPairs();
    }
  }, [allowOptionsFetch, getSpotTradingPairs]);

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
