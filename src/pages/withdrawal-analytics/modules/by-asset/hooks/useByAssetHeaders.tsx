import { mdiMinus } from "@mdi/js";
import { HeaderItem, Icon, Typography } from "@ui-kit";
import { formatAmount } from "@utils";

export const useByAssetHeaders = () => {
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
      width: "16.6%",
      maxWidth: "16.6%",
    },
    { text: "count", value: "count", width: "16.6%", maxWidth: "16.6%" },
    {
      text: "total amount",
      value: (item) =>
        typeof item.totalAmount === "string" &&
        typeof item.totalAmountByUsd === "string" &&
        typeof item.assetId === "string" ? (
          <div className="flex h-[60px] flex-col justify-center gap-1">
            <Typography>
              {formatAmount(+item.totalAmount)} {item.assetId}
            </Typography>
            <Typography variant="body-sm" color="secondary">
              {formatAmount(+item.totalAmountByUsd)} USD
            </Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "16.6%",
      maxWidth: "16.6%",
    },
    {
      text: "min amount",
      value: (item) =>
        typeof item.minimumAmount === "string" &&
        typeof item.minimumAmountByUsd === "string" &&
        typeof item.assetId === "string" ? (
          <div className="flex h-[60px] flex-col justify-center gap-1">
            <Typography>
              {formatAmount(+item.minimumAmount)} {item.assetId}
            </Typography>
            <Typography variant="body-sm" color="secondary">
              {formatAmount(+item.minimumAmountByUsd)} USD
            </Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "16.6%",
      maxWidth: "16.6%",
    },
    {
      text: "max amount",
      value: (item) =>
        typeof item.maximumAmount === "string" &&
        typeof item.maximumAmountByUsd === "string" &&
        typeof item.assetId === "string" ? (
          <div className="flex h-[60px] flex-col justify-center gap-1">
            <Typography>
              {formatAmount(+item.maximumAmount)} {item.assetId}
            </Typography>
            <Typography variant="body-sm" color="secondary">
              {formatAmount(+item.maximumAmountByUsd)} USD
            </Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "16.6%",
      maxWidth: "16.6%",
    },
    {
      text: "avg amount",
      value: (item) =>
        typeof item.averageAmount === "string" &&
        typeof item.averageAmountByUsd === "string" &&
        typeof item.assetId === "string" ? (
          <div className="flex h-[60px] flex-col justify-center gap-1">
            <Typography>
              {formatAmount(+item.averageAmount)} {item.assetId}
            </Typography>
            <Typography variant="body-sm" color="secondary">
              {formatAmount(+item.averageAmountByUsd)} USD
            </Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "16.6%",
      maxWidth: "16.6%",
    },
    {
      text: "total fee",
      value: (item) =>
        typeof item.totalFee === "string" &&
        typeof item.totalFeeByUsd === "string" &&
        typeof item.assetId === "string" ? (
          <div className="flex h-[60px] flex-col justify-center gap-1">
            <Typography>
              {formatAmount(+item.totalFee)} {item.assetId}
            </Typography>
            <Typography variant="body-sm" color="secondary">
              {formatAmount(+item.totalFeeByUsd)} USD
            </Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "16.6%",
      maxWidth: "16.6%",
    },
  ];

  return {
    headers,
  };
};
