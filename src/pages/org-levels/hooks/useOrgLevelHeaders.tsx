import { useMemo } from "react";

import { TableAction, TableActionsCell, TableStatusCell, TableSwitchCell } from "@containers";
import { OrgLevelFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { useStore } from "@store";
import { HeaderItem, TableItem } from "@ui-kit";

export const useOrgLevelHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setOrgLevel = useStore((s) => s.setOrgLevel);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("org_level_update")) tableActions.push("edit");
    if (checkPermission("org_level_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleEdit = (item: TableItem) => {
    setOrgLevel(item as OrgLevelFormValues);
    setDialogMode("update");
    setDialogs(["orgLevel"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "name", value: "name" },
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

  if (checkPermission("org_level_update")) {
    headers.splice(2, 0, {
      text: "enabled",
      value: (item) =>
        typeof item?.status === "number" && <TableSwitchCell status={item.status} id={item.id as number} />,
    });
  }

  return {
    headers,
  };
};
