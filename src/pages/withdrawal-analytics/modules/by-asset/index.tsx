import { useCallback, useEffect, useRef, useState } from "react";

import { TableContainer } from "@containers";
import {
  emptyWithdrawalByAssetFilters,
  WithdrawalByAssetFiltersForm,
  WithdrawalByAssetFiltersFormValues,
} from "@forms";
import { api } from "@services";
import { DataTable, TableFooter } from "@ui-kit";

import { useByAssetHeaders } from "./hooks/useByAssetHeaders";

export const ByAsset = () => {
  const { headers } = useByAssetHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    ...emptyWithdrawalByAssetFilters,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleFilter = useCallback(
    (filters: WithdrawalByAssetFiltersFormValues) => {
      setParams((prev) => ({ ...prev, ...filters }));
      canFetch.current = true;
    },
    [setParams]
  );

  const getWithdrawalsByAsset = useCallback(async () => {
    try {
      setLoading(true);

      const searchParams = new URLSearchParams();
      searchParams.append("page", String(params.page));
      searchParams.append("pageSize", String(params.pageSize));
      if (params.withdrawalDate.length === 2) {
        searchParams.append("dateFrom", new Date(params.withdrawalDate[0]).toISOString());
        searchParams.append(
          "dateTo",
          new Date(new Date(params.withdrawalDate[1]).getTime() + 24 * 60 * 60 * 1000).toISOString()
        );
      }
      params.assetIds.forEach((assetId) => searchParams.append("assetIds", assetId));

      const { data } = await api.get(`/analytics/api/walletTransaction/withdrawal`, {
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
      void getWithdrawalsByAsset();
    }
  }, [getWithdrawalsByAsset]);

  return (
    <div>
      <div className="flex justify-end p-4 pb-0">
        <WithdrawalByAssetFiltersForm onChange={handleFilter} />
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
