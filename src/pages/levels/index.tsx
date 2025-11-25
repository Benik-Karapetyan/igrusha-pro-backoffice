import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyLevel, LevelForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable, TableFooter } from "@ui-kit";

import { useLevelHeaders } from "./hooks/useLevelHeaders";

export const LevelsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useLevelHeaders();
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
  const setLevel = useStore((s) => s.setLevel);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setLevel(emptyLevel);
    setDialogMode("create");
    setDialogs(["level"]);
  };

  const getLevels = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/levels/all", { params });
      setItems(data.data.items);
      setTotalPages(data.data.totalPages);
      setTotalRecords(data.data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (!checkPermission("fee_level_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getLevels();
    }
  }, [checkPermission, navigate, getLevels]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("fee_level_create")}
        btnText="Add Level"
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

      <CreateUpdateDialog title="Level" dialogType="level">
        <LevelForm onSuccess={getLevels} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Level" updateUrl="levels" onSuccess={getLevels} />
      <DeleteDialog title="Level" deleteUrl="levels" idAsParam onSuccess={getLevels} />
    </div>
  );
};
