import { useCallback, useEffect, useRef, useState } from "react";

import { TableContainer } from "@containers";
import {
  emptyWithdrawalNetworkFilters,
  WithdrawalNetworkFiltersForm,
  WithdrawalNetworkFiltersFormValues,
} from "@forms";
import { api } from "@services";
import { DataTable, Icon, TableFooter, TextField } from "@ui-kit";
import { searchIcon } from "@utils";
import { debounce } from "lodash";

import { useNetworkHeaders } from "./hooks/useNetworkHeaders";

export const Network = () => {
  const { headers } = useNetworkHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    ...emptyWithdrawalNetworkFilters,
    assetId: "",
    network: "",
  });
  const [currenySearchValue, setCurrenySearchValue] = useState("");
  const [networkSearchValue, setNetworkSearchValue] = useState("");
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const debouncedCurrencySearchChange = useRef(
    debounce((assetId: string) => {
      setParams((prev) => ({ ...prev, page: 1, assetId }));
      canFetch.current = true;
    }, 500)
  ).current;

  const debouncedNetworkSearchChange = useRef(
    debounce((network: string) => {
      setParams((prev) => ({ ...prev, page: 1, network }));
      canFetch.current = true;
    }, 500)
  ).current;

  const handleCurrencySearchChange = (value: string) => {
    setCurrenySearchValue(value);
    debouncedCurrencySearchChange(value);
  };

  const handleNetworkSearchChange = (value: string) => {
    setNetworkSearchValue(value);
    debouncedNetworkSearchChange(value);
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleFilter = useCallback((filters: WithdrawalNetworkFiltersFormValues) => {
    setParams((prev) => ({ ...prev, ...filters }));
    canFetch.current = true;
  }, []);

  const getWithdrawalsByNetwork = useCallback(async () => {
    try {
      setLoading(true);

      const searchParams = new URLSearchParams();
      searchParams.append("page", String(params.page));
      searchParams.append("pageSize", String(params.pageSize));
      if (params.assetId) searchParams.append("assetId", params.assetId);
      if (params.network) searchParams.append("network", params.network);
      params.networks.forEach((network) => searchParams.append("networks", network));
      params.assetIds.forEach((assetId) => searchParams.append("assetIds", assetId));

      const { data } = await api.get(`/analytics/api/inflowOutflow/withdrawal`, {
        params: searchParams,
      });

      setItems(data.data);
      setTotalPages(data.meta.totalPages);
      setTotalRecords(data.meta.totalItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getWithdrawalsByNetwork();
    }
  }, [getWithdrawalsByNetwork]);

  return (
    <div>
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-5">
          <div className="flex w-[230px] flex-col gap-3">
            <TextField
              value={currenySearchValue}
              placeholder="Search by Currency"
              hideDetails
              prependInner={<Icon name={searchIcon} className="mr-2" />}
              onChange={(e) => handleCurrencySearchChange(e.target.value)}
            />
          </div>
          <div className="flex w-[230px] flex-col gap-3">
            <TextField
              value={networkSearchValue}
              placeholder="Search by Network"
              hideDetails
              prependInner={<Icon name={searchIcon} className="mr-2" />}
              onChange={(e) => handleNetworkSearchChange(e.target.value)}
            />
          </div>
        </div>

        <WithdrawalNetworkFiltersForm onChange={handleFilter} />
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
    </div>
  );
};
