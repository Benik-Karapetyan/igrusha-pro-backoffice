import { useMemo } from "react";

import { TableAction, TableActionsCell, TableDateCell, TableStatusCell, TableSwitchCell } from "@containers";
import { KycLimitFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { HeaderItem, Icon, TableItem } from "@ui-kit";

export const useKycLimitHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setKycLimit = useStore((s) => s.setKycLimit);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("kyc_limits_update")) tableActions.push("edit");
    if (checkPermission("kyc_limits_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleEdit = (item: TableItem) => {
    setKycLimit({ ...item, dailyLimit: item.dailyLimit === -1 ? "unlimited" : item.dailyLimit } as KycLimitFormValues);
    setDialogMode("update");
    setDialogs(["kycLimit"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    {
      text: "country",
      value: (item) =>
        typeof item.location === "object" && typeof item.location?.countryName === "string" ? (
          item.location.countryName
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "kyc level",
      value: (item) =>
        typeof item.kycLevel === "object" && typeof item.kycLevel?.name === "string" ? (
          item.kycLevel.name
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "product",
      value: (item) =>
        typeof item.product === "object" && typeof item.product?.name === "string" ? (
          item.product.status === 1 ? (
            item.product.name
          ) : (
            `${item.product.name} (N/A)`
          )
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "daily limit, USD",
      value: (item) => (item.dailyLimit === -1 ? "Unlimited" : typeof item.dailyLimit !== "object" && item.dailyLimit),
    },
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
          disabled={typeof item?.product === "object" && item?.product?.status !== 1 ? ["edit"] : []}
          item={item}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
      width: 80,
    },
  ];

  if (checkPermission("kyc_limits_update")) {
    headers.splice(7, 0, {
      text: "enabled",
      value: (item) =>
        typeof item?.status === "number" && <TableSwitchCell status={item.status} id={item.id as number} />,
    });
  }

  return { headers };
};
