import { useCallback, useEffect, useRef, useState } from "react";

import { AppHeader, ConfirmDialog, TableContainer } from "@containers";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { Button, DataTable, TableFooter } from "@ui-kit";
import { getErrorMessage } from "@utils";

import { useOrderHeaders } from "./hooks/useOrderHeaders";

export const OrdersPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { headers } = useOrderHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const selectedCompleteOrderId = useStore((s) => s.selectedCompleteOrderId);
  const setSelectedCompleteOrderId = useStore((s) => s.setSelectedCompleteOrderId);
  const [actionLoading, setActionLoading] = useState(false);
  const selectedConfirmReturnOrderId = useStore((s) => s.selectedConfirmReturnOrderId);
  const setSelectedConfirmReturnOrderId = useStore((s) => s.setSelectedConfirmReturnOrderId);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const completeOrder = async () => {
    try {
      setActionLoading(true);

      await api.patch(`/orders/${selectedCompleteOrderId}/complete`);
      setSelectedCompleteOrderId(null);
      toast.success("Order completed successfully");
      void getOrders();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const confirmReturn = async () => {
    try {
      setActionLoading(true);

      await api.patch(`/orders/${selectedConfirmReturnOrderId}/confirm-return`);
      setSelectedConfirmReturnOrderId(null);
      toast.success("Return confirmed successfully");
      void getOrders();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const getOrders = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/orders", { params });

      console.log("data", data.items);

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
      void getOrders();
    }
  }, [navigate, getOrders]);

  return (
    <div>
      <AppHeader title="Orders" MainButton={<Button>Add Order</Button>} />

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

      <ConfirmDialog
        open={!!selectedCompleteOrderId || !!selectedConfirmReturnOrderId}
        onOpenChange={() => {
          setSelectedCompleteOrderId(null);
          setSelectedConfirmReturnOrderId(null);
        }}
        title={selectedCompleteOrderId ? "Complete Order" : "Confirm Return"}
        text={
          selectedCompleteOrderId
            ? "Are you sure you want to complete this order?"
            : "Are you sure you want to confirm the return of this order?"
        }
        onCancel={() => {
          setSelectedCompleteOrderId(null);
          setSelectedConfirmReturnOrderId(null);
        }}
        loading={actionLoading}
        onConfirm={selectedCompleteOrderId ? completeOrder : confirmReturn}
      />
    </div>
  );
};
