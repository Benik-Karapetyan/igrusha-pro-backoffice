import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyNetwork, NetworkForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

import { useNetworkHeaders } from "./hooks/useNetworkHeaders";

export const NetworksPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useNetworkHeaders();
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
  const setNetwork = useStore((s) => s.setNetwork);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setNetwork(emptyNetwork);
    setDialogMode("create");
    setDialogs(["network"]);
  };

  const getNetworks = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/networks/all", { params });
      setItems(data);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!checkPermission("network_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getNetworks();
    }
  }, [checkPermission, navigate, getNetworks]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("network_create")}
        btnText="Add Network"
        onAddClick={handleAddClick}
      />

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

      <CreateUpdateDialog title="Network" dialogType="network">
        <NetworkForm onSuccess={getNetworks} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Network" updateUrl="networks" onSuccess={getNetworks} />
      <DeleteDialog title="Network" deleteUrl="networks" onSuccess={getNetworks} />
    </div>
  );
};
