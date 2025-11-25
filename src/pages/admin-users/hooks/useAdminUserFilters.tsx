import { useCallback, useEffect, useRef, useState } from "react";

import { AdminUserFiltersFormValues, adminUserFiltersValueMapper, emptyAdminUserFilters } from "@forms";
import { api } from "@services";
import { FilterItem, ISelectItem, RangeItem } from "@types";
import { format } from "date-fns";
import { omit } from "lodash";

export const useAdminUserFilters = () => {
  const [filters, setFilters] = useState(emptyAdminUserFilters);
  const canFetch = useRef(true);
  const [allowOptionsFetch, setAllowOptionsFetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    roles: [] as ISelectItem[],
    orgLevels: [] as ISelectItem[],
    brands: [] as ISelectItem[],
  });

  const fetchFilterOptions = () => setAllowOptionsFetch(true);

  const mapFilters = (adminUserFilters: AdminUserFiltersFormValues) => {
    const filters: FilterItem[] = [];
    const ranges: RangeItem[] = [];

    for (const key in omit(adminUserFilters, "createdDate", "modifiedDate", "lastLoginDate")) {
      if (adminUserFilters[key as keyof typeof adminUserFilters]) {
        const filter = adminUserFilters[key as keyof typeof adminUserFilters];

        if (Array.isArray(filter)) {
          if (filter.length) {
            filters.push({
              column: adminUserFiltersValueMapper[key as keyof typeof adminUserFiltersValueMapper],
              values: filter,
            });
          }
        } else {
          filters.push({
            column: adminUserFiltersValueMapper[key as keyof typeof adminUserFiltersValueMapper],
            values: [String(filter)],
          });
        }
      }
    }

    if (adminUserFilters.createdDate.length === 2) {
      ranges.push({
        column: 1,
        start: format(adminUserFilters.createdDate[0], "yyyy-MM-dd'T'HH:mm:ss"),
        end: format(adminUserFilters.createdDate[1], "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }

    if (adminUserFilters.modifiedDate.length === 2) {
      ranges.push({
        column: 2,
        start: format(adminUserFilters.modifiedDate[0], "yyyy-MM-dd'T'HH:mm:ss"),
        end: format(adminUserFilters.modifiedDate[1], "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }

    if (adminUserFilters.lastLoginDate.length === 2) {
      ranges.push({
        column: 2,
        start: format(adminUserFilters.lastLoginDate[0], "yyyy-MM-dd'T'HH:mm:ss"),
        end: format(adminUserFilters.lastLoginDate[1], "yyyy-MM-dd'T'HH:mm:ss"),
      });
    }

    setFilters(adminUserFilters);

    return {
      filters,
      ranges,
    };
  };

  const getRoles = useCallback(async () => {
    const { data } = await api.post("/bo/api/roles/all", { page: 1, pageSize: 10000 });
    return data.items
      .filter((item: { status: number }) => item.status === 1)
      .map((item: { name: string }) => ({ ...item, id: item.name }));
  }, []);

  const getOrgLevels = async () => {
    const { data } = await api.get("/bo/api/orgLevels/all?page=1&pageSize=10000");
    return data.items;
  };

  const getBrands = async () => {
    const { data } = await api.get("/bo/api/brands/all?page=1&pageSize=10000");
    return data.items;
  };

  const getAdminUserFilters = useCallback(async () => {
    try {
      canFetch.current = false;
      setLoading(true);
      const roles = await getRoles();
      const orgLevels = await getOrgLevels();
      const brands = await getBrands();

      setFilterOptions({
        roles,
        orgLevels,
        brands,
      });
    } catch (err) {
      setServerError(!!err);
    } finally {
      setLoading(false);
    }
  }, [getRoles]);

  useEffect(() => {
    if (allowOptionsFetch && canFetch.current) {
      void getAdminUserFilters();
    }
  }, [allowOptionsFetch, getAdminUserFilters]);

  return {
    filters,
    loading,
    serverError,
    ...filterOptions,
    fetchFilterOptions,
    mapFilters,
  };
};
