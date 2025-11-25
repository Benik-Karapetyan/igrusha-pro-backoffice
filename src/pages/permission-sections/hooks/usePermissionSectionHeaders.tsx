import { useMemo } from "react";

import { TableAction, TableActionsCell, TableStatusCell, TableSwitchCell } from "@containers";
import { PermissionSectionFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { useStore } from "@store";
import { HeaderItem, TableItem } from "@ui-kit";

export const usePermissionSectionHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setPermissionSection = useStore((s) => s.setPermissionSection);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("permission_sections_update")) tableActions.push("edit");
    if (checkPermission("permission_sections_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleEdit = (item: TableItem) => {
    const permissionIds = (item?.permissions as unknown as { id: number; name: string }[]).map((c) => c.id);
    setPermissionSection({ ...item, name: item.Name, permissionIds } as PermissionSectionFormValues);
    setDialogMode("update");
    setDialogs(["permissionSection"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "name", value: "Name" },
    {
      text: "permissions",
      value: (item) =>
        typeof item?.permissions === "object" && typeof item?.permissions?.name === "string"
          ? item?.permissions?.name
          : "",
    },
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

  if (checkPermission("permission_sections_update")) {
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
