import { useMemo } from "react";

import { TableAction, TableActionsCell, TableStatusCell, TableSwitchCell } from "@containers";
import { NetworkFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { useStore } from "@store";
import { HeaderItem, TableItem } from "@ui-kit";

export const useNetworkHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setNetwork = useStore((s) => s.setNetwork);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("network_update")) tableActions.push("edit");
    if (checkPermission("network_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleEdit = (item: TableItem) => {
    setNetwork(item as NetworkFormValues);
    setDialogMode("update");
    setDialogs(["network"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "name", value: "name" },
    { text: "key", value: "key" },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <TableStatusCell status={item.status} />,
    },
    {
      text: "",
      value: (item) => <TableActionsCell actions={actions} item={item} onEdit={handleEdit} onDelete={handleDelete} />,
      width: 80,
    },
  ];

  if (checkPermission("network_update")) {
    headers.splice(3, 0, {
      text: "enabled",
      value: (item) =>
        typeof item?.status === "number" && <TableSwitchCell status={item.status} id={item.id as number} />,
    });
  }

  return {
    headers,
  };
};
