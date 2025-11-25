import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptySmsProvider, SmsProviderForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

import { useSmsProviderHeaders } from "./hooks/useSmsProviderHeaders";

export const SmsProvidersPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useSmsProviderHeaders();
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
  const setSmsProvider = useStore((s) => s.setSmsProvider);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setSmsProvider(emptySmsProvider);
    setDialogMode("create");
    setDialogs(["smsProvider"]);
  };

  const getSmsProviders = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/smsProviders/all", { params });
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
    if (!checkPermission("sms_provider_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getSmsProviders();
    }
  }, [checkPermission, navigate, getSmsProviders]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("sms_provider_create")}
        btnText="Add Sms Provider"
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

      <CreateUpdateDialog title="Sms Provider" dialogType="smsProvider">
        <SmsProviderForm onSuccess={getSmsProviders} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Sms Provider" updateUrl="SmsProviders" onSuccess={getSmsProviders} />
      <DeleteDialog title="Sms Provider" deleteUrl="SmsProviders" onSuccess={getSmsProviders} />
    </div>
  );
};
