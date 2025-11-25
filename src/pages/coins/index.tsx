import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { CoinForm, emptyCoin } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

import { useCoinHeaders } from "./hooks/useCoinHeaders";

export const CoinsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useCoinHeaders();
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
  const setCoin = useStore((s) => s.setCoin);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setCoin(emptyCoin);
    setDialogMode("create");
    setDialogs(["coin"]);
  };

  const getCoins = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/coins/all", { params });
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
    if (!checkPermission("coin_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getCoins();
    }
  }, [checkPermission, navigate, getCoins]);

  return (
    <div>
      <AppToolbar hasCreatePermission={checkPermission("coin_create")} btnText="Add Coin" onAddClick={handleAddClick} />

      <TableContainer>
        <DataTable
          headers={headers}
          items={items}
          loading={loading}
          page={params.page}
          onPageChange={handlePageChange}
          itemsPerPage={params.pageSize}
          onItemsPerPageChange={handlePerPageChange}
          pageCount={totalPages}
          itemsTotalCount={totalRecords}
        />
      </TableContainer>

      <CreateUpdateDialog title="Coin" dialogType="coin">
        <CoinForm onSuccess={getCoins} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Coin" updateUrl="coins" onSuccess={getCoins} />
      <DeleteDialog title="Coin" deleteUrl="coins" onSuccess={getCoins} />
    </div>
  );
};
