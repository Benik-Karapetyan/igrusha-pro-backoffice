import { TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { HeaderItem, Icon, Typography } from "@ui-kit";
import { formatAmount } from "@utils";

export const useTradingContestTradeHistoryHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "trade ID",
      value: "id",
      width: 80,
      maxWidth: 80,
    },
    {
      text: "trading pairs",
      value: (item) =>
        typeof item.marketTradingPair === "string" ? (
          <div className="flex items-center gap-2">
            <img
              src={`/icons/currencies/${item.marketTradingPair.split("-")[0].toUpperCase()}.svg`}
              alt=""
              className="h-6 w-6"
            />
            <div className="w-[100px]">{item.marketTradingPair}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 95,
    },
    { text: "direction", value: "orderSide" },
    {
      text: "price",
      value: (item) => typeof item.executedPrice === "number" && formatAmount(item.executedPrice),
    },
    {
      text: () => (
        <div className="flex h-14 flex-col justify-center whitespace-nowrap">
          <div>quote amount</div>
          <Typography variant="heading-5" color="disabled">
            base amount
          </Typography>
        </div>
      ),
      value: (item) => (
        <div className="flex h-[60px] flex-col justify-center gap-1">
          {typeof item.filledValue === "number" && <div>{formatAmount(item.filledValue)}</div>}
          {typeof item.filledQuantity === "number" && (
            <Typography variant="body-sm" color="secondary">
              {formatAmount(item.filledQuantity)}
            </Typography>
          )}
        </div>
      ),
      width: 125,
    },
    {
      text: () => (
        <div className="flex h-14 flex-col justify-center whitespace-nowrap">
          <div>maker fee</div>
          <Typography variant="heading-5" color="disabled">
            taker fee
          </Typography>
        </div>
      ),
      value: (item) => (
        <div className="flex h-[60px] flex-col justify-center gap-1">
          {typeof item.makerFee === "number" && <div>{formatAmount(item.makerFee)}</div>}
          {typeof item.takerFee === "number" && (
            <Typography variant="body-sm" color="secondary">
              {formatAmount(item.takerFee)}
            </Typography>
          )}
        </div>
      ),
      width: 100,
    },
    {
      text: "executed at",
      value: (item) =>
        typeof item.executedAt === "string" ? <TableDateCell date={item.executedAt} /> : <Icon name={mdiMinus} dense />,
      width: 95,
    },
  ];

  return {
    headers,
  };
};
