import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
  WithdrawNodeDialog,
} from "@containers";
import { emptyNode, NodeForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable, TableFooter } from "@ui-kit";

import { useNodeHeaders } from "./hooks/useNodeHeaders";

export const NodesPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useNodeHeaders();
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
  const setNode = useStore((s) => s.setNode);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setNode(emptyNode);
    setDialogMode("create");
    setDialogs(["node"]);
  };

  const getNodes = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/nodes/all", { params });
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
    if (!checkPermission("node_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getNodes();
    }
  }, [checkPermission, navigate, getNodes]);

  return (
    <div>
      <AppToolbar hasCreatePermission={checkPermission("node_create")} btnText="Add Node" onAddClick={handleAddClick} />

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

      <CreateUpdateDialog title="Node" dialogType="node">
        <NodeForm onSuccess={getNodes} />
      </CreateUpdateDialog>
      <WithdrawNodeDialog onSuccess={getNodes} />
      <UnsavedChangesDialog />
      <StatusDialog title="Node" updateUrl="nodes" onSuccess={getNodes} />
      <DeleteDialog title="Node" deleteUrl="nodes" onSuccess={getNodes} />
    </div>
  );
};
