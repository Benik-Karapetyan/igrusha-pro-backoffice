import { useCallback, useEffect, useRef, useState } from "react";

import { TableContainer } from "@containers";
import { api } from "@services";
import { useParams } from "@tanstack/react-router";
import { DataTable, TableFooter } from "@ui-kit";

import { useIpAddressHeaders } from "./hooks/useIpAddressHeaders";

export const IpAddresses = () => {
  const { id } = useParams({ from: "/auth/customers/$id" });
  const { headers } = useIpAddressHeaders();
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

  const getIpAddresses = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/bo/api/customers/${id}/ipAddresses`, { params });

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, params]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getIpAddresses();
    }
  }, [getIpAddresses]);

  console.log("Items", items);

  return (
    <div className="-m-4">
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
