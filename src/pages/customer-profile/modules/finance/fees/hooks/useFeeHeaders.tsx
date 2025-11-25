import { TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { HeaderItem, Icon, Typography } from "@ui-kit";
import { formatAmount } from "@utils";

export const useFeeHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "event",
      value: (item) => typeof item.orderAction === "string" && item.orderAction.replace(/([a-z])([A-Z])/g, "$1 $2"),
      width: "25%",
      maxWidth: "25%",
    },
    {
      text: "ID",
      value: "id",
      width: "25%",
      maxWidth: "25%",
    },
    {
      text: "fee",
      value: (item) =>
        typeof item.amount === "number" && typeof item.assetId === "string" ? (
          <div className="flex items-center justify-between">
            {formatAmount(item.amount)} {item.assetId}
            <Typography variant="body-sm" color="secondary">
              {typeof item.equivalentAmount === "number" && `${formatAmount(item.equivalentAmount)} USD`}
            </Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "25%",
      maxWidth: "25%",
    },
    {
      text: "date",
      value: (item) =>
        typeof item.timestamp === "string" ? <TableDateCell date={item.timestamp} /> : <Icon name={mdiMinus} dense />,
      width: "25%",
      maxWidth: "25%",
    },
  ];

  return {
    headers,
  };
};
