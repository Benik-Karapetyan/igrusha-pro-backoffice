import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyScanner, ScannerForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

import { useScannerHeaders } from "./hooks/useScannerHeaders";

export const ScannersPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useScannerHeaders();
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
  const setScanner = useStore((s) => s.setScanner);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setScanner(emptyScanner);
    setDialogMode("create");
    setDialogs(["scanner"]);
  };

  const getScanners = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/scanners/all", { params });
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
    if (!checkPermission("scanner_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getScanners();
    }
  }, [checkPermission, navigate, getScanners]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("scanner_create")}
        btnText="Add Scanner"
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

      <CreateUpdateDialog title="Scanner" dialogType="scanner">
        <ScannerForm onSuccess={getScanners} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Scanner" updateUrl="scanners" onSuccess={getScanners} />
      <DeleteDialog title="Scanner" deleteUrl="scanners" onSuccess={getScanners} />
    </div>
  );
};
