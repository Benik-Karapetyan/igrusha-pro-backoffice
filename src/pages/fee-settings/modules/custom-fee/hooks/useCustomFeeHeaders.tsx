import { TableActionsCell } from "@containers";
import { CustomFeeFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { HeaderItem, Icon, TableItem } from "@ui-kit";

export const useCustomFeeHeaders = () => {
  const setCustomFee = useStore((s) => s.setCustomFee);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setDrawerOpen = useStore((s) => s.setDrawerOpen);

  const handleEdit = (item: TableItem) => {
    setCustomFee({
      ...item,
      locationId: 250,
      tradingProductType: 1,
      levelId: (item.level as { id: number }).id,
    } as CustomFeeFormValues);
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
      width: "33.3%",
    },
    {
      text: "maker fee %",
      value: (item) => (typeof item.makerFee === "number" ? `${item.makerFee} %` : <Icon name={mdiMinus} dense />),
      width: "33.3%",
    },
    {
      text: "taker fee %",
      value: (item) => (typeof item.takerFee === "number" ? `${item.takerFee} %` : <Icon name={mdiMinus} dense />),
      width: "33.3%",
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
