import { useMemo } from "react";

import { TableAction, TableActionsCell, TableDateCell } from "@containers";
import { WithdrawalDepositSettingFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { HeaderItem, Icon, TableItem } from "@ui-kit";
import { formatScientificToFullNumber } from "@utils";

export const useWithdrawalDepositSettingHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setWithdrawalDepositSetting = useStore((s) => s.setWithdrawalDepositSetting);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("withdrawal_deposit_settings_update")) tableActions.push("edit");

    return tableActions;
  }, [checkPermission]);

  const handleEdit = (item: TableItem) => {
    setWithdrawalDepositSetting(item as WithdrawalDepositSettingFormValues);
    setDialogMode("update");
    setDialogs(["withdrawalDepositSetting"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "coin name", value: "coinName" },
    { text: "network", value: "networkName" },
    {
      text: "min deposit",
      value: (item) => (typeof item.minDeposit === "number" ? formatScientificToFullNumber(item.minDeposit) : ""),
    },
    {
      text: "min withdrawal",
      value: (item) => (typeof item.minWithdrawal === "number" ? formatScientificToFullNumber(item.minWithdrawal) : ""),
    },
    {
      text: "max withdrawal",
      value: (item) => (typeof item.maxWithdrawal === "number" ? formatScientificToFullNumber(item.maxWithdrawal) : ""),
    },
    {
      text: "withdrawal fee",
      value: (item) => (typeof item.withdrawalFee === "number" ? formatScientificToFullNumber(item.withdrawalFee) : ""),
    },
    {
      text: "deposit fee",
      value: (item) => (typeof item.depositFee === "number" ? formatScientificToFullNumber(item.depositFee) : ""),
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
      width: 48,
    },
  ];

  return { headers };
};
