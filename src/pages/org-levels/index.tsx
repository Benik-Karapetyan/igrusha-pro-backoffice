import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyOrgLevel, OrgLevelForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

import { useOrgLevelHeaders } from "./hooks/useOrgLevelHeaders";

export const OrgLevelsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useOrgLevelHeaders();
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
  const setOrgLevel = useStore((s) => s.setOrgLevel);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setOrgLevel(emptyOrgLevel);
    setDialogMode("create");
    setDialogs(["orgLevel"]);
  };

  const getOrgLevels = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/orgLevels/all", { params });
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
    if (!checkPermission("org_level_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getOrgLevels();
    }
  }, [checkPermission, navigate, getOrgLevels]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("org_level_create")}
        btnText="Add Org Level"
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

      <CreateUpdateDialog title="Org Level" dialogType="orgLevel">
        <OrgLevelForm onSuccess={getOrgLevels} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Org Level" updateUrl="orgLevels" onSuccess={getOrgLevels} />
      <DeleteDialog title="Org Level" deleteUrl="orgLevels" onSuccess={getOrgLevels} />
    </div>
  );
};
