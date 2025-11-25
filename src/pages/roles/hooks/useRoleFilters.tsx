import { useCallback, useEffect, useRef, useState } from "react";

import { emptyRoleFilters, RoleFiltersFormValues, roleFiltersValueMapper } from "@forms";
import { api } from "@services";
import { FilterItem, ISelectItem, RangeItem } from "@types";
import { format } from "date-fns";
import { omit } from "lodash";

export const useRoleFilters = () => {
  const [filters, setFilters] = useState(emptyRoleFilters);
  const canFetch = useRef(true);
  const [allowOptionsFetch, setAllowOptionsFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    modifiedByItems: [] as ISelectItem[],
  });

  const fetchFilterOptions = () => setAllowOptionsFetch(true);

  const mapFilters = (roleFilters: RoleFiltersFormValues) => {
    const filters: FilterItem[] = [];
    const ranges: RangeItem[] = [];

    for (const key in omit(roleFilters, "createdDate", "modifiedDate", "userCountMin", "userCountMax")) {
      if (roleFilters[key as keyof typeof roleFilters]) {
        const filter = roleFilters[key as keyof typeof roleFilters];

        filters.push({
          column: roleFiltersValueMapper[key as keyof typeof roleFiltersValueMapper],
          values: [String(filter)],
        });
      }
    }

    if (roleFilters.createdDate.length === 2) {
      ranges.push({
        column: 1,
        start: format(roleFilters.createdDate[0], "yyyy-MM-dd'T'HH:mm:ss"),
        end: format(roleFilters.createdDate[1], "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }

    if (roleFilters.modifiedDate.length === 2) {
      ranges.push({
        column: 2,
        start: format(roleFilters.modifiedDate[0], "yyyy-MM-dd'T'HH:mm:ss"),
        end: format(roleFilters.modifiedDate[1], "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }

    if (roleFilters.userCountMin || roleFilters.userCountMax) {
      ranges.push({
        column: 3,
        start: String(roleFilters.userCountMin) || "0",
        end: String(roleFilters.userCountMax) || "1000000",
      });
    }

    setFilters(roleFilters);

    return {
      filters,
      ranges,
    };
  };

  const getRoleFilters = useCallback(async () => {
    try {
      canFetch.current = false;
      setLoading(true);

      const { data } = await api.get("/bo/api/roles/filtering-options");

      const modifiedByItems = (data.options as { columnName: string; possibleValues: ISelectItem[] }[]).find(
        (option) => option.columnName === "ModifiedBy"
      )?.possibleValues;

      if (modifiedByItems) {
        setFilterOptions({
          modifiedByItems,
        });
      } else {
        setServerError(true);
      }
    } catch (err) {
      setServerError(!!err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (allowOptionsFetch && canFetch.current) {
      void getRoleFilters();
    }
  }, [allowOptionsFetch, getRoleFilters]);

  return {
    filters,
    loading,
    serverError,
    ...filterOptions,
    fetchFilterOptions,
    mapFilters,
  };
};
