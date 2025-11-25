import { useCallback, useEffect, useRef, useState } from "react";

import {
  emptySpotTradingPairFilters,
  SpotTradingPairFiltersFormValues,
  spotTradingPairFiltersValueMapper,
} from "@forms";
import { api } from "@services";
import { FilterItem, ISelectItem, RangeItem } from "@types";
import { format } from "date-fns";
import { omit } from "lodash";

export const useSpotTradingPairFilters = () => {
  const [filters, setFilters] = useState(emptySpotTradingPairFilters);
  const canFetch = useRef(true);
  const [allowOptionsFetch, setAllowOptionsFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    coins: [] as ISelectItem[],
    marketCategories: [] as ISelectItem[],
  });

  const fetchFilterOptions = () => setAllowOptionsFetch(true);

  const mapFilters = (spotTradingPairFilters: SpotTradingPairFiltersFormValues) => {
    const filters: FilterItem[] = [];
    const ranges: RangeItem[] = [];

    for (const key in omit(spotTradingPairFilters, "createdAt", "updatedAt")) {
      if (
        spotTradingPairFilters[key as keyof typeof spotTradingPairFilters] === 0 ||
        spotTradingPairFilters[key as keyof typeof spotTradingPairFilters]
      ) {
        const filter = spotTradingPairFilters[key as keyof typeof spotTradingPairFilters];

        if (Array.isArray(filter)) {
          if (filter.length) {
            filters.push({
              column: spotTradingPairFiltersValueMapper[key as keyof typeof spotTradingPairFiltersValueMapper],
              values: filter,
            });
          }
        } else {
          filters.push({
            column: spotTradingPairFiltersValueMapper[key as keyof typeof spotTradingPairFiltersValueMapper],
            values: [String(filter)],
          });
        }
      }
    }

    if (spotTradingPairFilters.createdAt.length === 2) {
      ranges.push({
        column: 1,
        start: format(spotTradingPairFilters.createdAt[0], "yyyy-MM-dd'T'HH:mm:ss"),
        end: format(spotTradingPairFilters.createdAt[1], "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }

    if (spotTradingPairFilters.updatedAt.length === 2) {
      ranges.push({
        column: 2,
        start: format(spotTradingPairFilters.updatedAt[0], "yyyy-MM-dd'T'HH:mm:ss"),
        end: format(spotTradingPairFilters.updatedAt[1], "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }

    setFilters(spotTradingPairFilters);

    return {
      filters,
      ranges,
    };
  };

  const getCoins = async () => {
    const { data } = await api.get("/bo/api/coins/all?page=1&pageSize=10000");
    return data.items.filter((item: { status: number }) => item.status === 1);
  };

  const getMarketCategories = useCallback(async () => {
    const { data } = await api.get("/bo/api/marketCategories/all?page=1&pageSize=10000");
    return data.items
      .filter((item: { status: number }) => item.status === 1)
      .map((item: { name: string }) => ({ ...item, id: item.name }));
  }, []);

  const getSpotTradingPairFilters = useCallback(async () => {
    try {
      canFetch.current = false;
      setLoading(true);
      const coins = await getCoins();
      const marketCategories = await getMarketCategories();

      setFilterOptions({
        coins,
        marketCategories,
      });
    } catch (err) {
      setServerError(!!err);
    } finally {
      setLoading(false);
    }
  }, [getMarketCategories]);

  useEffect(() => {
    if (allowOptionsFetch && canFetch.current) {
      void getSpotTradingPairFilters();
    }
  }, [allowOptionsFetch, getSpotTradingPairFilters]);

  return {
    filters,
    loading,
    serverError,
    ...filterOptions,
    fetchFilterOptions,
    mapFilters,
  };
};
