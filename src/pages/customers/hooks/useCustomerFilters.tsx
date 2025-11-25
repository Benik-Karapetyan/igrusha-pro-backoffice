import { useCallback, useEffect, useRef, useState } from "react";

import { customerFiltersColumnMapper, CustomerFiltersFormValues, emptyCustomerFilters } from "@forms";
import { api } from "@services";
import { FilterItem, ISelectItem, RangeItem } from "@types";
import { format } from "date-fns";
import { omit } from "lodash";

export const useCustomerFilters = () => {
  const [filters, setFilters] = useState(emptyCustomerFilters);
  const canFetch = useRef(true);
  const [allowOptionsFetch, setAllowOptionsFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    kycCountries: [] as ISelectItem[],
    levels: [] as ISelectItem[],
    lastLoginCountries: [] as ISelectItem[],
  });

  const fetchFilterOptions = () => setAllowOptionsFetch(true);

  const mapFilters = (customerFilters: CustomerFiltersFormValues) => {
    const filters: FilterItem[] = [];
    const ranges: RangeItem[] = [];

    for (const key in omit(customerFilters, "registrationDate", "lastLoginDate")) {
      if (
        customerFilters[key as keyof typeof customerFilters] === 0 ||
        customerFilters[key as keyof typeof customerFilters]
      ) {
        filters.push({
          column: customerFiltersColumnMapper[key as keyof typeof customerFiltersColumnMapper],
          values: [String(customerFilters[key as keyof typeof customerFilters])],
        });
      }
    }

    if (customerFilters.registrationDate.length === 2) {
      ranges.push({
        column: 1,
        start: format(customerFilters.registrationDate[0], "yyyy-MM-dd'T'HH:mm:ss"),
        end: format(customerFilters.registrationDate[1], "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }

    if (customerFilters.lastLoginDate.length === 2) {
      ranges.push({
        column: 2,
        start: format(customerFilters.lastLoginDate[0], "yyyy-MM-dd'T'HH:mm:ss"),
        end: format(customerFilters.lastLoginDate[1], "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }

    setFilters(customerFilters);

    return {
      filters,
      ranges,
    };
  };

  const getCustomerFilters = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/customers/filtering-options");

      const kycCountries = (data.options as { columnName: string; possibleValues: ISelectItem[] }[]).find(
        (option) => option.columnName === "Country"
      )?.possibleValues;
      const levels = (data.options as { columnName: string; possibleValues: ISelectItem[] }[]).find(
        (option) => option.columnName === "Level"
      )?.possibleValues;
      const lastLoginCountries = (data.options as { columnName: string; possibleValues: ISelectItem[] }[]).find(
        (option) => option.columnName === "Country"
      )?.possibleValues;

      if (kycCountries && levels && lastLoginCountries) {
        setFilterOptions({
          kycCountries,
          levels,
          lastLoginCountries,
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
      canFetch.current = false;
      void getCustomerFilters();
    }
  }, [allowOptionsFetch, getCustomerFilters]);

  return {
    filters,
    loading,
    serverError,
    ...filterOptions,
    fetchFilterOptions,
    mapFilters,
  };
};
