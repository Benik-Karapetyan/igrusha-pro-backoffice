import { useCallback, useMemo } from "react";

import { TableAction, TableActionsCell, TableDateCell, TableStatusCell, TableSwitchCell } from "@containers";
import { useCheckPermission } from "@hooks";
import { mdiMinus } from "@mdi/js";
import { IAdminUserRole, IResetPasswordData, useStore } from "@store";
import { useRouter } from "@tanstack/react-router";
import { Button, HeaderItem, Icon, TableItem } from "@ui-kit";
import { pick } from "lodash";

export const useAdminUserHeaders = () => {
  const router = useRouter();
  const user = useStore((s) => s.auth.user);
  const setDialogs = useStore((s) => s.setDialogs);
  const setSelectedAdminUserRoles = useStore((s) => s.setSelectedAdminUserRoles);
  const setResetPasswordData = useStore((s) => s.setResetPasswordData);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const getActions = useCallback(
    (item: TableItem) => {
      const tableActions: TableAction[] = [];

      if (checkPermission("admin_user_read")) tableActions.push("watch");
      if (checkPermission("admin_user_update") && item.status !== 3) tableActions.push("resetPassword");
      if (checkPermission("admin_user_delete")) tableActions.push("delete");

      return tableActions;
    },
    [checkPermission]
  );

  const handleDetailsClick = useCallback(
    (item: TableItem) => {
      setSelectedAdminUserRoles((item as unknown as { userRoles: IAdminUserRole[] }).userRoles);
      setDialogs(["adminUserRoles"]);
    },
    [setSelectedAdminUserRoles, setDialogs]
  );

  const handleResetPassword = useCallback(
    (item: TableItem) => {
      setResetPasswordData(pick(item, "email", "username", "phone") as IResetPasswordData);
      setDialogs(["resetPassword"]);
    },
    [setResetPasswordData, setDialogs]
  );

  const handleDelete = useCallback(
    (id: number) => {
      setSelectedIds([id]);
      setDialogs(["delete"]);
    },
    [setSelectedIds, setDialogs]
  );

  const openInNewTab = useCallback(
    (item: TableItem) => {
      const newUrl = router.buildLocation({
        to: "/admin-users/admin-user",
        search: { id: String(item.id) },
      }).href;

      window.open(newUrl, "_blank");
    },
    [router]
  );

  const headers = useMemo(() => {
    const initHeaders: HeaderItem[] = [
      { text: "full name", value: "fullName" },
      { text: "email", value: "email" },
      // {
      //   text: "org lvl",
      //   value: (item) =>
      //     typeof item?.orgLevel === "object" && typeof item?.orgLevel?.name === "string" ? item?.orgLevel?.name : "",
      // },
      // {
      //   text: "brand",
      //   value: (item) =>
      //     typeof item?.brand === "object" && typeof item?.brand?.name === "string" ? item?.brand?.name : "",
      // },
      {
        text: "created at",
        value: (item) => typeof item?.createdAt === "string" && <TableDateCell date={item.createdAt} />,
      },
      {
        text: "created by",
        value: (item) =>
          typeof item?.creator === "object" &&
          `${item.creator.firstName}${item.creator.lastName ? " " + item.creator.lastName : ""}`,
      },
      {
        text: "modified at",
        value: (item) =>
          typeof item?.updatedAt === "string" ? (
            <TableDateCell date={item.updatedAt} />
          ) : (
            <Icon name={mdiMinus} dense />
          ),
      },
      {
        text: "last login",
        value: (item) =>
          typeof item?.lastLogin === "string" ? (
            <TableDateCell date={item.lastLogin} />
          ) : (
            <Icon name={mdiMinus} dense />
          ),
      },
      {
        text: "roles",
        value: (item) =>
          Array.isArray(item.userRoles) && item.userRoles.length ? (
            <Button variant="link" size="link" onClick={() => handleDetailsClick(item)}>
              Details
            </Button>
          ) : (
            <Icon name={mdiMinus} dense />
          ),
      },
      {
        text: "status",
        value: (item) => typeof item?.status === "number" && <TableStatusCell status={item.status} />,
      },
      {
        text: "",
        value: (item) => (
          <TableActionsCell
            actions={getActions(item)}
            item={item}
            disabled={
              user?.email === item.email
                ? ["watch", "resetPassword", "delete"]
                : item?.status === 3
                  ? ["resetPassword"]
                  : []
            }
            onWatch={(item) => openInNewTab(item)}
            onResetPassword={(item) => handleResetPassword(item)}
            onDelete={handleDelete}
          />
        ),
        width: 112,
      },
    ];

    if (checkPermission("admin_user_update")) {
      initHeaders.splice(9, 0, {
        text: "enabled",
        value: (item) =>
          typeof item?.status === "number" && (
            <TableSwitchCell status={item.status} id={item.id as number} disabled={user?.email === item.email} />
          ),
      });
    }

    return initHeaders;
  }, [user?.email, checkPermission, handleDetailsClick, getActions, openInNewTab, handleResetPassword, handleDelete]);

  return {
    headers,
  };
};
