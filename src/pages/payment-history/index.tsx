import { useCallback, useEffect, useState } from "react";

import { AppToolbar, TableContainer } from "@containers";
import { api } from "@services";
import { DataTable, TableFooter } from "@ui-kit";

import { usePaymentHistoryHeaders } from "./hooks/usePaymentHistoryHeaders";

export const PaymentHistoryPage = () => {
  const { headers } = usePaymentHistoryHeaders();
  const [params, setParams] = useState({
    page: 1,
    take: 10,
  });
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, take: +pageSize }));
  };

  const getPaymentHistory = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/payment/orders", { params });
      setItems(data.data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    getPaymentHistory();
  }, [getPaymentHistory]);

  return (
    <div>
      <AppToolbar />

      <TableContainer>
        <div className="overflow-auto">
          <DataTable headers={headers} items={items} loading={loading} hideFooter />
        </div>

        <table className="w-full">
          <TableFooter
            headersLength={headers.length}
            page={params.page}
            onPageChange={handlePageChange}
            itemsPerPage={params.take}
            onItemsPerPageChange={handlePerPageChange}
            pageCount={totalPages}
            itemsTotalCount={totalRecords}
          />
        </table>
      </TableContainer>
    </div>
  );
};
