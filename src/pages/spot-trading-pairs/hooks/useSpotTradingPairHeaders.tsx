import { useMemo } from "react";

import { TableAction, TableActionsCell, TableDateCell } from "@containers";
import {
  SpotTradingPairFormValues,
  SpotTradingPairStatusFormValues,
  SpotTradingPairStatusValues,
  tradingModesActive,
  TradingModeValues,
} from "@forms";
import { useCheckPermission } from "@hooks";
import { mdiMinus } from "@mdi/js";
import { ISelectedSpotTradingPair, useStore } from "@store";
import { Checkbox, HeaderItem, Icon, Select, Switch, TableItem } from "@ui-kit";
import { cn, formatScientificToFullNumber } from "@utils";
import { differenceInMinutes, format } from "date-fns";

export const useSpotTradingPairHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setSpotTradingPair = useStore((s) => s.setSpotTradingPair);
  const setSelectedElementEnabled = useStore((s) => s.setSelectedElementEnabled);
  const setSpotTradingPairStatus = useStore((s) => s.setSpotTradingPairStatus);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const allSpotTradingPairsSelected = useStore((s) => s.allSpotTradingPairsSelected);
  const setAllSpotTradingPairsSelected = useStore((s) => s.setAllSpotTradingPairsSelected);
  const setSelectedSpotTradingPair = useStore((s) => s.setSelectedSpotTradingPair);
  const selectedSpotTradingPairs = useStore((s) => s.selectedSpotTradingPairs);
  const setSelectedSpotTradingPairs = useStore((s) => s.setSelectedSpotTradingPairs);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("markets_list_update")) tableActions.push("edit");
    if (checkPermission("markets_list_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleItemSelect = (item: TableItem) => {
    if (typeof item.id === "number") {
      if (selectedSpotTradingPairs.find((tp) => tp.id === item.id)) {
        const newSelectedSpotTradingPairs = selectedSpotTradingPairs.filter((tp) => tp.id !== item.id);
        setSelectedSpotTradingPairs(newSelectedSpotTradingPairs);
      } else {
        const newSelectedSpotTradingPairs = [...selectedSpotTradingPairs];
        newSelectedSpotTradingPairs.push({
          id: item.id,
          ...(item.state as Omit<ISelectedSpotTradingPair, "id">),
        });
        setSelectedSpotTradingPairs(newSelectedSpotTradingPairs);
      }
    }
  };

  const handleSwitchClick = (item: TableItem) => {
    setSelectedElementEnabled((item.state as { status: SpotTradingPairStatusValues }).status !== "Inactive");
    setSpotTradingPairStatus({
      id: item.id,
      tradingMode: (item.state as { tradingMode: TradingModeValues }).tradingMode || "",
      enableMatching: (item.state as { isMatchingEnabled: boolean }).isMatchingEnabled,
      status: (item.state as { status: SpotTradingPairStatusValues }).status,
      durationInMinutes:
        typeof item.state === "object" &&
        (item.state as { tradingModeEndDate: string }).tradingModeEndDate &&
        (item.state as { tradingModeStartDate: string }).tradingModeStartDate
          ? differenceInMinutes(
              item.state.tradingModeEndDate as unknown as Date,
              item.state.tradingModeStartDate as unknown as Date
            )
          : "",
    } as SpotTradingPairStatusFormValues);
    setDialogs(["spotTradingPairStatus"]);
  };

  const handleStatusChange = (item: TableItem, value: string) => {
    setSelectedElementEnabled(false);
    setSpotTradingPairStatus({
      id: item.id,
      tradingMode: value,
      enableMatching: value === "PostOnly" ? false : true,
      status: (item.state as { status: SpotTradingPairStatusValues }).status,
      ...(value === "FullTrading"
        ? {}
        : {
            durationInMinutes:
              typeof item.state === "object" &&
              (item.state as { tradingModeEndDate: string }).tradingModeEndDate &&
              (item.state as { tradingModeStartDate: string }).tradingModeStartDate
                ? differenceInMinutes(
                    item.state.tradingModeEndDate as unknown as Date,
                    item.state.tradingModeStartDate as unknown as Date
                  )
                : "",
          }),
    } as SpotTradingPairStatusFormValues);
    setDialogs(["spotTradingPairStatus"]);
  };

  const handleMatchingClick = (item: TableItem) => {
    if (typeof item.id === "number") {
      setSelectedSpotTradingPair({
        id: item.id,
        ...(item.state as Omit<ISelectedSpotTradingPair, "id">),
      });
      setDialogs(["spotTradingPairMatching"]);
    }
  };

  const handleEdit = (item: TableItem) => {
    const categoriesId = (item?.categories as unknown as { id: number; name: string }[]).map((c) => c.id);
    setSpotTradingPair({ ...item, categoriesId } as SpotTradingPairFormValues);
    setDialogMode("update");
    setDialogs(["spotTradingPair"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    {
      text: () => (
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSpotTradingPairsSelected}
            onClick={() => setAllSpotTradingPairsSelected(!allSpotTradingPairsSelected)}
          />
          trading pair name
        </div>
      ),
      value: (item) =>
        typeof item.id === "number" &&
        typeof item.name === "string" && (
          <div className="flex items-center gap-3">
            <Checkbox
              checked={!!selectedSpotTradingPairs.find((tp) => tp.id === item.id)}
              onClick={() => handleItemSelect(item)}
            />

            {item.name}
          </div>
        ),
    },
    {
      text: "base asset",
      value: (item) =>
        typeof item?.firstCoin === "object" && typeof item?.firstCoin?.symbol === "string"
          ? item?.firstCoin?.symbol
          : "",
    },
    {
      text: "quote asset",
      value: (item) =>
        typeof item?.secondCoin === "object" && typeof item?.secondCoin?.symbol === "string"
          ? item?.secondCoin?.symbol
          : "",
    },
    {
      text: "base min order amount",
      value: (item) => (typeof item.baseMinAmount === "number" ? formatScientificToFullNumber(item.baseMinAmount) : ""),
    },
    { text: "base max order amount", value: "baseMaxAmount" },
    {
      text: "quote min order amount",
      value: (item) =>
        typeof item.quoteMinAmount === "number" ? formatScientificToFullNumber(item.quoteMinAmount) : "",
    },
    { text: "quote max order amount", value: "quoteMaxAmount" },
    {
      text: "min price increment",
      value: (item) => (typeof item.step === "number" ? formatScientificToFullNumber(item.step) : ""),
    },
    {
      text: "amount increment",
      value: (item) =>
        typeof item.baseAmountIncrement === "number" ? formatScientificToFullNumber(item.baseAmountIncrement) : "",
    },
    { text: "amount precision", value: "baseAmountPrecision" },
    { text: "price precision", value: "pricePrecision" },
    {
      text: "category",
      value: (item) =>
        Array.isArray(item?.categories) && item.categories.length ? (
          item.categories.map((c) => <div key={c.name}>{c.name}</div>)
        ) : (
          <Icon name={mdiMinus} dense />
        ),
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
      text: "trading mode",
      value: (item) =>
        typeof item.state === "object" && typeof item.state.tradingMode === "string" ? (
          checkPermission("markets_list_update") ? (
            <div className="p-0.5">
              <Select
                value={item.state.tradingMode}
                items={tradingModesActive}
                hideDetails
                onValueChange={(value) => handleStatusChange(item, value)}
              />
            </div>
          ) : (
            item.state.tradingMode
          )
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 170,
    },
    {
      text: "trading mode duration",
      value: (item) =>
        typeof item.state === "object" &&
        typeof item.state.tradingModeStartDate === "string" &&
        typeof item.state.tradingModeEndDate === "string" ? (
          <>
            <div>{format(item.state.tradingModeStartDate, "yyyy-MM-dd HH:mm:ss")}</div>
            <div>{format(item.state.tradingModeEndDate, "yyyy-MM-dd HH:mm:ss")}</div>
          </>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "status",
      value: (item) =>
        typeof item?.state === "object" && (
          <div
            className={cn(
              item.state.status === "Active"
                ? "text-state-success-foreground"
                : item.state.status === "Preactive"
                  ? "text-state-warning-foreground"
                  : item.state.status === "Inactive"
                    ? "text-state-info-foreground"
                    : "text-state-destructive-foreground"
            )}
          >
            {typeof item.state === "object" && typeof item.state.status === "string"
              ? item.state.status === "Preactive"
                ? "Pre Active"
                : item.state.status
              : ""}
          </div>
        ),
    },
    {
      text: "",
      value: (item) => <TableActionsCell actions={actions} item={item} onEdit={handleEdit} onDelete={handleDelete} />,
      width: 80,
    },
  ];

  if (checkPermission("markets_list_update")) {
    headers.splice(
      14,
      0,
      {
        text: "enabled",
        value: (item) =>
          typeof item?.state === "object" && (
            <Switch
              checked={item.state.status === "Preactive" || item.state.status === "Active"}
              disabled={item.state.status === "Deleted"}
              onClick={() => handleSwitchClick(item)}
            />
          ),
      },
      {
        text: "matching",
        value: (item) =>
          typeof item?.state === "object" && (
            <Switch
              checked={!!item.state.isMatchingEnabled}
              disabled={
                item.state.status === "Inactive" || item.state.status === "Blocked" || item.state.status === "Deleted"
              }
              onClick={() => handleMatchingClick(item)}
            />
          ),
      }
    );
  }

  return {
    headers,
  };
};
