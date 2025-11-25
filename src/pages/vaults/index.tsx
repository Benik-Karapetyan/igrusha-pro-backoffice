import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
  VaultAssetDialog,
  WithdrawVaultDialog,
} from "@containers";
import { emptyVault, VaultForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

import { useVaultHeaders } from "./hooks/useVaultHeaders";

export const VaultsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useVaultHeaders();
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
  const setVault = useStore((s) => s.setVault);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setVault(emptyVault);
    setDialogMode("create");
    setDialogs(["vault"]);
  };

  const getVaults = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/vaults/all", { params });
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
    if (!checkPermission("vault_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getVaults();
    }
  }, [checkPermission, navigate, getVaults]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("vault_create")}
        btnText="Add Vault"
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

      <CreateUpdateDialog title="Vault" dialogType="vault">
        <VaultForm onSuccess={getVaults} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <VaultAssetDialog />
      <WithdrawVaultDialog onSuccess={getVaults} />
      <StatusDialog title="Vault" updateUrl="vaults" onSuccess={getVaults} />
      <DeleteDialog title="Vault" deleteUrl="vaults" onSuccess={getVaults} />
    </div>
  );
};
