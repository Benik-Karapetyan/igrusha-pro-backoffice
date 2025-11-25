import { OrderHistoryStatusCell, TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { ENUM_ORDER_HISTORY_STATUS } from "@types";
import { HeaderItem, Icon, Typography } from "@ui-kit";
import { cn, formatAmount } from "@utils";

export const useOrderHistoryHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "order ID",
      value: "id",
      width: 100,
      maxWidth: 100,
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
      width: 180,
      maxWidth: 180,
    },
    { text: "order type", value: "type", width: 120, maxWidth: 120 },
    {
      text: "direction",
      value: (item) =>
        typeof item.side === "string" && (
          <div
            className={cn({
              "text-state-success-foreground": item.side === "Buy",
              "text-state-destructive-foreground": item.side === "Sell",
            })}
          >
            {item.side}
          </div>
        ),
    },
    {
      text: () => (
        <div className="flex h-14 flex-col justify-center gap-1">
          <Typography variant="heading-4" color="secondary">
            order price
          </Typography>
          <Typography variant="heading-5" color="disabled">
            avg. filled price
          </Typography>
        </div>
      ),
      value: (item) => (
        <div className="flex h-14 flex-col justify-center gap-1">
          {typeof item.orderPrice === "string" && <Typography>{formatAmount(+item.orderPrice)}</Typography>}
          {typeof item.avgFilledPrice === "string" && (
            <Typography variant="body-sm" color="secondary">
              {formatAmount(+item.avgFilledPrice)}
            </Typography>
          )}
        </div>
      ),
      width: 180,
      maxWidth: 180,
    },
    {
      text: () => (
        <div className="flex h-14 flex-col justify-center gap-1">
          <Typography variant="heading-4" color="secondary">
            order quantity
          </Typography>
          <Typography variant="heading-5" color="disabled">
            filled quantity
          </Typography>
        </div>
      ),
      value: (item) => (
        <div className="flex h-14 flex-col justify-center gap-1">
          {typeof item.orderQuantityBase === "number" && (
            <Typography>{formatAmount(item.orderQuantityBase)}</Typography>
          )}
          {typeof item.filledQuantityBase === "number" && (
            <Typography variant="body-sm" color="secondary">
              {formatAmount(item.filledQuantityBase)}
            </Typography>
          )}
        </div>
      ),
      width: 180,
      maxWidth: 180,
    },
    {
      text: () => (
        <div className="flex h-14 flex-col justify-center gap-1">
          <Typography variant="heading-4" color="secondary">
            order value
          </Typography>
          <Typography variant="heading-5" color="disabled">
            filled value
          </Typography>
        </div>
      ),
      value: (item) => (
        <div className="flex h-14 flex-col justify-center gap-1">
          {typeof item.orderValueQuote === "number" && <Typography>{formatAmount(item.orderValueQuote)}</Typography>}
          {typeof item.filledValueQuote === "number" && (
            <Typography variant="body-sm" color="secondary">
              {formatAmount(item.filledValueQuote)}
            </Typography>
          )}
        </div>
      ),
      width: 180,
      maxWidth: 180,
    },
    {
      text: "status",
      value: (item) =>
        typeof item.status === "string" && <OrderHistoryStatusCell status={item.status as ENUM_ORDER_HISTORY_STATUS} />,
    },
    {
      text: () => (
        <div className="flex h-14 flex-col justify-center gap-1">
          <Typography variant="heading-4" color="secondary">
            creation time
          </Typography>
          <Typography variant="heading-5" color="disabled">
            execution time
          </Typography>
        </div>
      ),
      value: (item) =>
        typeof item.createdAt === "string" ? (
          <div className="flex items-center gap-1">
            <div className="flex flex-col justify-center gap-1">
              <TableDateCell date={item.createdAt} />
              {item.executedAt === "string" && <TableDateCell date={item.executedAt} />}
            </div>

            {/* <TableActionsCell actions={["watch"]} item={item} className="ml-auto" /> */}
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
  ];

  return {
    headers,
  };
};
