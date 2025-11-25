import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyTradingFee, TradingFeeForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable, TableFooter } from "@ui-kit";

import { useTradingFeeHeaders } from "./hooks/useTradingFeeHeaders";

export const TradingFeesPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useTradingFeeHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setTradingFee = useStore((s) => s.setTradingFee);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setTradingFee(emptyTradingFee);
    setDialogMode("create");
    setDialogs(["tradingFee"]);
  };

  const getTradingFees = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/fees/all", { params });
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
    if (!checkPermission("spot_trading_fees_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getTradingFees();
    }
  }, [checkPermission, navigate, getTradingFees]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("spot_trading_fees_create")}
        btnText="Add Trading Fee"
        onAddClick={handleAddClick}
      />

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

      <CreateUpdateDialog title="Trading Fee" dialogType="tradingFee">
        <TradingFeeForm onSuccess={getTradingFees} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Trading Fee" updateUrl="fees" onSuccess={getTradingFees} />
      <DeleteDialog title="Trading Fee" deleteUrl="fees" idAsParam onSuccess={getTradingFees} />
    </div>
  );
};
