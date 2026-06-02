import { useCallback, useEffect, useRef, useState } from "react";

import { ConfirmDialog } from "@components";
import { AppDrawer, AppHeader, DeleteOrderDialog, RangePickerDialog, TableContainer } from "@containers";
import { emptyOrder, OrderForm, orderStatuses } from "@forms";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { ENUM_ORDER_STATUS } from "@types";
import { Autocomplete, Button, DataTable, Icon, TableFooter, TextField, Typography } from "@ui-kit";
import { calendarIcon, formatCurrency, getErrorMessage } from "@utils";

import { useOrderHeaders } from "./hooks/useOrderHeaders";

export const OrdersPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { headers } = useOrderHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    statuses: [] as ENUM_ORDER_STATUS[],
    from: "",
    to: "",
  });
  const [dates, setDates] = useState<string[]>([]);
  const [datesOpen, setDatesOpen] = useState(false);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const drawerType = useStore((s) => s.drawerType);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setOrder = useStore((s) => s.setOrder);
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

  const handleStatusesChange = (statuses: ENUM_ORDER_STATUS[]) => {
    setParams((prev) => ({ ...prev, statuses }));
    canFetch.current = true;
  };

  const handleDatesChange = (dates: string[]) => {
    setDates(dates);
    setDatesOpen(false);
    setParams((prev) => ({ ...prev, from: dates[0], to: dates[1] }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setOrder(emptyOrder);
    setDialogMode("create");
    setDrawerType("order");
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

      const queryParams = new URLSearchParams();
      queryParams.append("page", params.page.toString());
      queryParams.append("pageSize", params.pageSize.toString());
      if (params.statuses.length) {
        params.statuses.forEach((status) => {
          queryParams.append("statuses", status);
        });
      }

      if (params.from && params.to) {
        queryParams.append("from", params.from);
        queryParams.append("to", params.to);
      }

      const { data } = await api.get("/orders", { params: queryParams });

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
      setTotalAmount(data.totalAmount);
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
      <AppHeader title="Orders" MainButton={<Button onClick={handleAddClick}>Add Order</Button>} />

      <div className="flex gap-4 p-4 pb-0">
        <div className="w-[250px]">
          <Autocomplete
            placeholder="Order Status"
            selectedItems={params.statuses}
            items={orderStatuses}
            hasSearch={false}
            onChange={handleStatusesChange}
          />
        </div>

        <div className="w-[250px]">
          <TextField
            placeholder="DD.MM.YYYY  DD.MM.YYYY"
            value={dates.length ? `${dates[0]} - ${dates[1]}` : ""}
            readOnly
            hideDetails
            appendInner={<Icon name={calendarIcon} />}
            onClick={() => setDatesOpen(true)}
          />

          <RangePickerDialog
            title="Expense Creation Date"
            open={datesOpen}
            onOpenChange={setDatesOpen}
            value={dates}
            onConfirm={(val) => {
              if (Array.isArray(val)) {
                handleDatesChange(val);
              }
            }}
          />
        </div>
      </div>

      <TableContainer itemsLength={items.length}>
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

      <div className="px-4">
        <div className="flex justify-end gap-3 border bg-white px-6 py-4">
          <Typography variant="body-lg">Total Amount For Given Period:</Typography>
          <Typography variant="body-lg" color="success">
            {formatCurrency(totalAmount)}
          </Typography>
        </div>
      </div>

      <AppDrawer open={drawerType === "order"} onOpenChange={(open) => setDrawerType(open ? "order" : null)} size="lg">
        <OrderForm onSuccess={getOrders} />
      </AppDrawer>

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

      <DeleteOrderDialog onSuccess={getOrders} />
    </div>
  );
};
