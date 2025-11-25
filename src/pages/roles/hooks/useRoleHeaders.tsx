import { useEffect, useMemo, useState } from "react";

import { TableAction, TableActionsCell, TableStatusCell, TableSwitchCell } from "@containers";
import { useCheckPermission } from "@hooks";
import { mdiMinus } from "@mdi/js";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { ISelectItem } from "@types";
import { HeaderItem, Icon } from "@ui-kit";
import { format } from "date-fns";

export const useRoleHeaders = () => {
  const navigate = useNavigate();
  const setDialogs = useStore((s) => s.setDialogs);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();
  const [orgLevels, setOrgLevels] = useState<ISelectItem[]>([]);

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("roles_read")) tableActions.push("watch");
    if (checkPermission("roles_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const getOrgLevels = async () => {
    try {
      const { data } = await api.get("/bo/api/orgLevels/all?page=1&pageSize=10000");
      setOrgLevels(data.items);
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => {
    getOrgLevels();
  }, []);

  const headers: HeaderItem[] = [
    { text: "name", value: "name" },
    { text: "description", value: "description", maxWidth: 300 },
    { text: "admin user count", value: "userCount" },
    {
      text: "org level",
      value: (item) =>
        typeof item?.orgLevelId === "number" ? (
          orgLevels.find((ol) => ol.id === item.orgLevelId)?.name
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    { text: "modified by", value: "updatedBy" },
    {
      text: "created at",
      value: (item) => (typeof item?.createdAt === "string" ? format(item?.createdAt, "yyyy-MM-dd HH:mm") : ""),
    },
    {
      text: "modified at",
      value: (item) => (typeof item?.updatedAt === "string" ? format(item?.updatedAt, "yyyy-MM-dd HH:mm") : ""),
    },
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
          onWatch={(item) => navigate({ to: "/roles/role", search: { id: String(item.id) } })}
          onDelete={handleDelete}
        />
      ),
      width: 80,
    },
  ];

  if (checkPermission("roles_update")) {
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
