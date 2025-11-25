import { TableActionsCell } from "@containers";
import { LevelFeeFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { HeaderItem, Icon, TableItem } from "@ui-kit";

export const useLevelsFeeHeaders = () => {
  const setLevelFee = useStore((s) => s.setLevelFee);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setDrawerOpen = useStore((s) => s.setDrawerOpen);

  const handleEdit = (item: TableItem) => {
    setLevelFee({ ...item, regionId: 250, tradingProductType: 1 } as LevelFeeFormValues);
    setDialogMode("update");
    setDrawerOpen(true);
  };

  const headers: HeaderItem[] = [
    {
      text: "name",
      value: (item) =>
        item.level && typeof item.level === "object" && typeof item.level.name === "string" ? (
          item.level.name
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "25%",
    },
    {
      text: "30-day trade volume",
      value: (item) =>
        typeof item.tradeVolumeIn30Days === "number" ? (
          `${item.tradeVolumeIn30Days} USD`
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "25%",
    },
    {
      text: "maker fee %",
      value: (item) => (typeof item.makerFee === "number" ? `${item.makerFee} %` : <Icon name={mdiMinus} dense />),
      width: "25%",
    },
    {
      text: "taker fee %",
      value: (item) => (typeof item.takerFee === "number" ? `${item.takerFee} %` : <Icon name={mdiMinus} dense />),
      width: "25%",
    },
    {
      text: "",
      value: (item) => <TableActionsCell actions={["edit"]} item={item} onEdit={handleEdit} />,
      width: 48,
    },
  ];

  return {
    headers,
  };
};
