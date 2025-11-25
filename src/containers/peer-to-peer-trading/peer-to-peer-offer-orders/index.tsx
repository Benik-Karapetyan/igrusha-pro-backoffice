import { useCallback, useEffect, useRef, useState } from "react";

import { api } from "@services";
import { DataTable, TableFooter } from "@ui-kit";

import { usePeerToPeerOfferHeaders } from "./hooks/usePeerToPeerOfferOrderHeaders";

export const PeerToPeerOfferOrders = () => {
  const { headers } = usePeerToPeerOfferHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
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

  const getPeerToPeerOfferOrders = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post(`/bo/api/customers/all`, params);

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getPeerToPeerOfferOrders();
    }
  }, [getPeerToPeerOfferOrders]);

  return (
    <div className="w-full overflow-hidden rounded-md">
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
    </div>
  );
};
