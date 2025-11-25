import { useMemo } from "react";

import { TableAction, TableActionsCell, TableStatusCell, TableSwitchCell } from "@containers";
import { NodeFormValues } from "@forms";
import { useCheckPermission, useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { HeaderItem, TableItem } from "@ui-kit";
import { getErrorMessage } from "@utils";

export const useNodeHeaders = () => {
  const toast = useToast();
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setNode = useStore((s) => s.setNode);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = ["start", "stop", "withdraw"];

    if (checkPermission("node_update")) tableActions.push("edit");
    if (checkPermission("node_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleStart = async (id: number) => {
    try {
      await api.post(`/bo/api/nodes/startscan/${id}`);
      toast.success("Wallet started");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleStop = async (id: number) => {
    try {
      await api.post(`/bo/api/nodes/stopscan/${id}`);
      toast.success("Wallet stopped");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleWithdraw = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["withdrawNode"]);
  };

  const handleEdit = (item: TableItem) => {
    setNode({
      ...item,
      scannerId: (item.scanner as TableItem).id,
      networkId: (item.network as TableItem).id,
    } as NodeFormValues);
    setDialogMode("update");
    setDialogs(["node"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "name", value: "name" },
    { text: "rpc", value: "rpc", width: 150 },
    { text: "username", value: "username" },
    { text: "stack", value: "stack" },
    {
      text: "network",
      value: (item) =>
        typeof item?.network === "object" && item?.network?.name === "string" ? item?.network?.name : "",
    },
    { text: "withdraw balance", value: "withdrawBalance" },
    { text: "block number", value: "blockNumber" },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <TableStatusCell status={item.status} />,
    },
    {
      text: "",
      value: (item) => (
        <TableActionsCell
          actions={actions}
          item={item}
          onWithdraw={handleWithdraw}
          onStart={handleStart}
          onStop={handleStop}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
      width: 176,
    },
  ];

  if (checkPermission("node_update")) {
    headers.splice(8, 0, {
      text: "enabled",
      value: (item) =>
        typeof item?.status === "number" && <TableSwitchCell status={item.status} id={item.id as number} />,
    });
  }

  return {
    headers,
  };
};
