import { CopyToClipboard, TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { HeaderItem, Icon, TableItem, Typography } from "@ui-kit";
import { formatAmount } from "@utils";

export const useTradingHistoryHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "trade ID",
      value: "id",
      width: 80,
      maxWidth: 80,
    },
    {
      text: "order ID",
      value: "orderId",
      width: 80,
      maxWidth: 80,
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
    {
      text: "buyer ID",
      value: (item: TableItem) =>
        typeof item.buyer === "object" &&
        typeof item.buyer.customerId === "string" && (
          <div className="flex items-center">
            <div className="overflow-hidden text-ellipsis" title={item.buyer.customerId}>
              {item.buyer.customerId}
            </div>
            <CopyToClipboard text={item.buyer.customerId} size="iconSmall" />
          </div>
        ),
      width: 150,
      maxWidth: 150,
    },
    {
      text: "seller ID",
      value: (item: TableItem) =>
        typeof item.seller === "object" &&
        typeof item.seller.customerId === "string" && (
          <div className="flex items-center">
            <div className="overflow-hidden text-ellipsis" title={item.seller.customerId}>
              {item.seller.customerId}
            </div>
            <CopyToClipboard text={item.seller.customerId} size="iconSmall" />
          </div>
        ),
      width: 150,
      maxWidth: 150,
    },
    {
      text: "maker ID",
      value: (item: TableItem) =>
        typeof item.maker === "object" &&
        typeof item.maker.customerId === "string" && (
          <div className="flex items-center">
            <div className="overflow-hidden text-ellipsis" title={item.maker.customerId}>
              {item.maker.customerId}
            </div>
            <CopyToClipboard text={item.maker.customerId} size="iconSmall" />
          </div>
        ),
      width: 150,
      maxWidth: 150,
    },
    {
      text: "taker ID",
      value: (item: TableItem) =>
        typeof item.taker === "object" &&
        typeof item.taker.customerId === "string" && (
          <div className="flex items-center">
            <div className="overflow-hidden text-ellipsis" title={item.taker.customerId}>
              {item.taker.customerId}
            </div>
            <CopyToClipboard text={item.taker.customerId} size="iconSmall" />
          </div>
        ),
      width: 150,
      maxWidth: 150,
    },
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
