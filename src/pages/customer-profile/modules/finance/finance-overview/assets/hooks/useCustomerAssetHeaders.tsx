import { mdiMinus } from "@mdi/js";
import { HeaderItem, Icon } from "@ui-kit";
import { formatAmount } from "@utils";

export const useCustomerAssetHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "asset",
      value: (item) => (
        <div className="flex items-center gap-2">
          {typeof item.assetId === "string" ? (
            <>
              <img src={`/icons/currencies/${item.assetId.toUpperCase()}.svg`} alt="" className="h-5 w-5" />

              {item.assetId}
            </>
          ) : (
            <Icon name={mdiMinus} dense />
          )}
        </div>
      ),
      width: 150,
    },
    {
      text: "total balance",
      value: (item) =>
        typeof item.total === "object" && typeof item.total.amount === "number" ? (
          formatAmount(item.total.amount)
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "25%",
    },
    {
      text: "available balance",
      value: (item) =>
        typeof item.available === "object" && typeof item.available.amount === "number" ? (
          formatAmount(item.available.amount)
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "20%",
    },
    {
      text: "locked balance",
      value: (item) =>
        typeof item.locked === "object" && typeof item.locked.amount === "number" ? (
          formatAmount(item.locked.amount)
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "20%",
    },
    {
      text: "value (USD)",
      value: (item) =>
        typeof item.total === "object" && typeof item.total.equivalent === "number" ? (
          `${formatAmount(item.total.equivalent)} ${item.total.equivalentAssetId}`
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 190,
    },
    {
      text: "24H PnL",
      value: "",
      width: 190,
    },
    {
      text: "absolute value",
      value: "",
      width: 190,
    },
  ];

  return {
    headers,
  };
};
