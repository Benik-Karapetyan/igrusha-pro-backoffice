import { useMemo } from "react";

import { TableAction, TableActionsCell, TableDateCell, TableStatusCell, TableSwitchCell } from "@containers";
import { TradingFeeFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { HeaderItem, Icon, TableItem } from "@ui-kit";

export const useTradingFeeHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setTradingFee = useStore((s) => s.setTradingFee);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("spot_trading_fees_update")) tableActions.push("edit");
    if (checkPermission("spot_trading_fees_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleEdit = (item: TableItem) => {
    setTradingFee({ ...item, isDefault: +(item.isDefault as number) } as TradingFeeFormValues);
    setDialogMode("update");
    setDialogs(["tradingFee"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    {
      text: "region",
      value: (item) => {
        if (item.region && typeof item.region === "object" && "countryName" in item.region) {
          return item.region?.countryName as string;
        }
        return "Global";
      },
    },
    {
      text: "level",
      value: (item) =>
        item.level && typeof item?.level === "object" ? (
          item.level.name && typeof item.level.name === "string" ? (
            `${item.level.name} ${item.isDefault ? "(Default)" : ""}`
          ) : (
            ""
          )
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    { text: "30-Day Trade Volume (USD)", value: "tradeVolumeIn30Days" },
    {
      text: "Maker / Taker Fee (%)",
      value: (item) => (
        <div>
          {typeof item.makerFee === "number" ? `${item.makerFee}%` : <Icon name={mdiMinus} dense />}/
          {typeof item.takerFee === "number" ? `${item.takerFee}%` : <Icon name={mdiMinus} dense />}
        </div>
      ),
    },
    // {
    //   text: "Maker/Taker Fee % (with Rebate)",
    //   value: "Maker/Taker Fee % (with Rebate)",
    // },
    {
      text: "modified at",
      value: (item) =>
        typeof item?.modifiedAt === "string" ? (
          <TableDateCell date={item.modifiedAt} />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "modified by",
      value: "modifiedBy",
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
          disabled={item.isDefault ? ["delete"] : []}
          item={item}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
      width: 80,
    },
  ];

  if (checkPermission("spot_trading_fees_update")) {
    headers.splice(7, 0, {
      text: "enabled",
      value: (item) =>
        typeof item?.status === "number" && (
          <TableSwitchCell status={item.status} id={item.id as number} disabled={!!item.isDefault} />
        ),
    });
  }

  return {
    headers,
  };
};
