import { CopyToClipboard, OrderHistoryStatusCell, TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { ENUM_ORDER_HISTORY_STATUS } from "@types";
import { HeaderItem, Icon, TableItem } from "@ui-kit";
import { cn, formatAmount } from "@utils";

export const useOrderHistoryHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "customer ID",
      value: (item: TableItem) =>
        typeof item.customer === "object" &&
        typeof item.customer.customerId === "string" && (
          <div className="flex">
            <div className="overflow-hidden text-ellipsis" title={item.customer.customerId}>
              {item.customer.customerId}
            </div>
            <CopyToClipboard text={item.customer.customerId} size="iconSmall" />
          </div>
        ),
      width: 160,
      maxWidth: 160,
    },
    {
      text: "order ID",
      value: "id",
      width: 74,
    },
    {
      text: "trading pair",
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
    { text: "order type", value: "type", width: 90 },
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
        <div>
          <div>order price</div>
          <div className="text-foreground-muted-more">avg. filled price</div>
        </div>
      ),
      value: (item) => (
        <div>
          {typeof item.orderPrice === "string" && <div>{formatAmount(+item.orderPrice)}</div>}
          {typeof item.avgFilledPrice === "string" && (
            <div className="text-foreground-muted-more">{formatAmount(+item.avgFilledPrice)}</div>
          )}
        </div>
      ),
      width: 150,
    },
    {
      text: () => (
        <div className="flex flex-col">
          <div>order quantity</div>
          <div className="text-foreground-muted-more">filled quantity</div>
        </div>
      ),
      value: (item) => (
        <div>
          {typeof item.orderQuantityBase === "number" && <div>{formatAmount(item.orderQuantityBase)}</div>}
          {typeof item.filledQuantityBase === "number" && (
            <div className="text-foreground-muted-more">{formatAmount(item.filledQuantityBase)}</div>
          )}
        </div>
      ),
      width: 150,
    },
    {
      text: () => (
        <div className="flex flex-col">
          <div>order value</div>
          <div className="text-foreground-muted-more">filled value</div>
        </div>
      ),
      value: (item) => (
        <div>
          {typeof item.orderValueQuote === "number" && <div>{formatAmount(item.orderValueQuote)}</div>}
          {typeof item.filledValueQuote === "number" && (
            <div className="text-foreground-muted-more">{formatAmount(item.filledValueQuote)}</div>
          )}
        </div>
      ),
      width: 150,
    },
    {
      text: "status",
      value: (item) =>
        typeof item.status === "string" && <OrderHistoryStatusCell status={item.status as ENUM_ORDER_HISTORY_STATUS} />,
    },
    {
      text: () => (
        <div className="flex flex-col">
          <div>created at</div>
          <div className="text-foreground-muted-more">executed at</div>
        </div>
      ),
      value: (item) =>
        typeof item.createdAt === "string" ? (
          <div>
            <TableDateCell date={item.createdAt} />
            {item.executedAt === "string" && <TableDateCell date={item.executedAt} />}
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
