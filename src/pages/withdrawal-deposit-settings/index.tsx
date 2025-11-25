import { useCallback, useEffect, useRef, useState } from "react";

import { CreateUpdateDialog, TableContainer, UnsavedChangesDialog } from "@containers";
import { WithdrawalDepositSettingForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable, TableFooter } from "@ui-kit";

import { useWithdrawalDepositSettingHeaders } from "./hooks/useWithdrawalDepositSettingHeaders";

export const WithdrawalDepositSettingsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useWithdrawalDepositSettingHeaders();
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

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const getWithdrawalDepositSettings = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/assetTransactionSettings/all", { params });
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
    if (!checkPermission("withdrawal_deposit_settings_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getWithdrawalDepositSettings();
    }
  }, [checkPermission, navigate, getWithdrawalDepositSettings]);

  return (
    <div>
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

      <CreateUpdateDialog title="Withdrawal & Deposit Settings" dialogType="withdrawalDepositSetting">
        <WithdrawalDepositSettingForm onSuccess={getWithdrawalDepositSettings} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog
        onCancel={() => setDialogs(["withdrawalDepositSetting"])}
        onConfirm={() => setDialogs([])}
      />
    </div>
  );
};
