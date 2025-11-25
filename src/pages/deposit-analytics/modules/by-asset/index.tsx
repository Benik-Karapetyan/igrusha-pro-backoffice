import { useCallback, useEffect, useRef, useState } from "react";

import { TableContainer } from "@containers";
import { DepositByAssetFiltersForm, DepositByAssetFiltersFormValues, emptyDepositByAssetFilters } from "@forms";
import { api } from "@services";
import { DataTable, TableFooter } from "@ui-kit";

import { useByAssetHeaders } from "./hooks/useByAssetHeaders";

export const ByAsset = () => {
  const { headers } = useByAssetHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    ...emptyDepositByAssetFilters,
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
    (filters: DepositByAssetFiltersFormValues) => {
      setParams((prev) => ({ ...prev, ...filters }));
      canFetch.current = true;
    },
    [setParams]
  );

  const getDepositsByAsset = useCallback(async () => {
    try {
      setLoading(true);

      const searchParams = new URLSearchParams();
      searchParams.append("page", String(params.page));
      searchParams.append("pageSize", String(params.pageSize));
      if (params.depositDate.length === 2) {
        searchParams.append("dateFrom", new Date(params.depositDate[0]).toISOString());
        searchParams.append(
          "dateTo",
          new Date(new Date(params.depositDate[1]).getTime() + 24 * 60 * 60 * 1000).toISOString()
        );
      }
      params.assetIds.forEach((assetId) => searchParams.append("assetIds", assetId));

      const { data } = await api.get(`/analytics/api/walletTransaction/deposit`, {
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
      void getDepositsByAsset();
    }
  }, [getDepositsByAsset]);

  return (
    <div>
      <div className="flex justify-end p-4 pb-0">
        <DepositByAssetFiltersForm onChange={handleFilter} />
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
