import { useMemo } from "react";

import { TableAction, TableActionsCell, TableStatusCell, TableSwitchCell } from "@containers";
import { SmsProviderFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { useStore } from "@store";
import { HeaderItem, TableItem } from "@ui-kit";

export const useSmsProviderHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setSmsProvider = useStore((s) => s.setSmsProvider);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("sms_provider_update")) tableActions.push("edit");
    if (checkPermission("sms_provider_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleEdit = (item: TableItem) => {
    const locationIds = (item?.locations as unknown as { id: number; name: string }[]).map((c) => c.id);
    setSmsProvider({ ...item, locationIds } as SmsProviderFormValues);
    setDialogMode("update");
    setDialogs(["smsProvider"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "name", value: "name" },
    { text: "description", value: "description" },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <TableStatusCell status={item.status} />,
    },
    {
      text: "regions",
      value: (item) =>
        typeof item?.locations === "object" && typeof item?.locations?.countryName === "string"
          ? item?.locations?.countryName
          : "",
    },
    {
      text: "",
      value: (item) => <TableActionsCell actions={actions} item={item} onEdit={handleEdit} onDelete={handleDelete} />,
      width: 80,
    },
  ];

  if (checkPermission("sms_provider_update")) {
    headers.splice(4, 0, {
      text: "enabled",
      value: (item) =>
        typeof item?.status === "number" && <TableSwitchCell status={item.status} id={item.id as number} />,
    });
  }

  return {
    headers,
  };
};
