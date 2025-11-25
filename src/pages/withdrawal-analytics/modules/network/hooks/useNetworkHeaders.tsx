import { TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { HeaderItem, Icon, Typography } from "@ui-kit";
import { formatAmount } from "@utils";

export const useNetworkHeaders = () => {
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
      width: "20%",
      maxWidth: "20%",
    },
    { text: "network", value: "network", width: "20%", maxWidth: "20%" },
    {
      text: "total deposit amount",
      value: (item) =>
        typeof item.amount === "string" && typeof item.amountByUsd === "string" && typeof item.assetId === "string" ? (
          <div className="flex h-[60px] flex-col justify-center gap-1">
            <Typography>
              {formatAmount(+item.amount)} {item.assetId}
            </Typography>
            <Typography variant="body-sm" color="secondary">
              {formatAmount(+item.amountByUsd)} USD
            </Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "first deposit date",
      value: (item) => typeof item.firstUsedDate === "string" && <TableDateCell date={item.firstUsedDate} />,
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "last deposit date",
      value: (item) => typeof item.lastUsedDate === "string" && <TableDateCell date={item.lastUsedDate} />,
      width: "20%",
      maxWidth: "20%",
    },
  ];

  return {
    headers,
  };
};
