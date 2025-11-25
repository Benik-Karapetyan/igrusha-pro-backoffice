import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  ConfirmDialog,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
  WithdrawAssetDialog,
} from "@containers";
import { AssetForm, emptyAsset } from "@forms";
import { useCheckPermission, useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable, TableFooter } from "@ui-kit";
import { getErrorMessage } from "@utils";

import { useAssetHeaders } from "./hooks/useAssetHeaders";

export const AssetsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const toast = useToast();
  const { headers } = useAssetHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [deployLoading, setDeployLoading] = useState(false);
  const selectedIds = useStore((s) => s.selectedIds);
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setAsset = useStore((s) => s.setAsset);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setAsset(emptyAsset);
    setDialogMode("create");
    setDialogs(["asset"]);
  };

  const getAssets = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/assets/all", { params });
      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const handleDeploy = async () => {
    try {
      setDeployLoading(true);

      await api.put(`/bo/api/assets/deploy/${selectedIds[0]}`);
      setDialogs([]);
      toast.success("Asset successfully deployed");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeployLoading(false);
    }
  };

  useEffect(() => {
    if (!checkPermission("asset_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getAssets();
    }
  }, [checkPermission, navigate, getAssets]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("asset_create")}
        btnText="Add Asset"
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

      <CreateUpdateDialog title="Asset" dialogType="asset">
        <AssetForm onSuccess={getAssets} />
      </CreateUpdateDialog>
      <WithdrawAssetDialog onSuccess={getAssets} />
      <UnsavedChangesDialog />
      <ConfirmDialog
        title="Deploy Asset"
        text="Are you sure you want to deploy this element?"
        confirmBtnText="Deploy"
        loading={deployLoading}
        onCancel={() => setDialogs([])}
        onConfirm={handleDeploy}
      />
      <StatusDialog title="Asset" updateUrl="assets" onSuccess={getAssets} />
      <DeleteDialog title="Asset" deleteUrl="assets" onSuccess={getAssets} />
    </div>
  );
};
