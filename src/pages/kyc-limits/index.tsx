import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyKycLimit, KycLimitForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable, TableFooter } from "@ui-kit";

import { useKycLimitHeaders } from "./hooks/useKycLimitHeaders";

export const KycLimitsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useKycLimitHeaders();
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
  const setKycLimit = useStore((s) => s.setKycLimit);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setKycLimit(emptyKycLimit);
    setDialogMode("create");
    setDialogs(["kycLimit"]);
  };

  const getKycLimits = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/accountFeatures/all", { params });
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
    if (!checkPermission("kyc_limits_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getKycLimits();
    }
  }, [checkPermission, navigate, getKycLimits]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("kyc_limits_create")}
        btnText="Add KYC Limit"
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

      <CreateUpdateDialog title="KYC Limit" dialogType="kycLimit">
        <KycLimitForm onSuccess={getKycLimits} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="KYC Limit" updateUrl="accountFeatures" onSuccess={getKycLimits} />
      <DeleteDialog title="KYC Limit" deleteUrl="accountFeatures" idAsParam onSuccess={getKycLimits} />
    </div>
  );
};
