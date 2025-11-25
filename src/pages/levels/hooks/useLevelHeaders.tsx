import { useMemo } from "react";

import { TableAction, TableActionsCell, TableDateCell, TableStatusCell, TableSwitchCell } from "@containers";
import { LevelFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { HeaderItem, Icon, TableItem } from "@ui-kit";

export const useLevelHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setLevel = useStore((s) => s.setLevel);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("fee_level_update")) tableActions.push("edit");
    if (checkPermission("fee_level_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleEdit = (item: TableItem) => {
    setLevel({ ...item, isDefault: +(item.isDefault as number) } as LevelFormValues);
    setDialogMode("update");
    setDialogs(["level"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "level", value: (item) => (item.isDefault ? `${item.name} (Default)` : (item.name as string)) },
    { text: "description", value: "description", maxWidth: 220 },
    {
      text: "modified at",
      value: (item) =>
        typeof item?.modifiedAt === "string" ? (
          <TableDateCell date={item.modifiedAt} />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    { text: "modified by", value: "modifiedBy" },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <TableStatusCell status={item.status} />,
    },
    {
      text: "",
      value: (item) => (
        <TableActionsCell
          actions={actions}
          disabled={item.isDefault ? ["edit", "delete"] : []}
          item={item}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
      width: 80,
    },
  ];

  if (checkPermission("fee_level_update")) {
    headers.splice(5, 0, {
      text: "enabled",
      value: (item) =>
        typeof item?.status === "number" && <TableSwitchCell status={item.status} id={item.id as number} />,
    });
  }

  return { headers };
};
