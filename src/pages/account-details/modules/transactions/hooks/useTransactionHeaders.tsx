import { mdiMinus } from "@mdi/js";
import { useParams } from "@tanstack/react-router";
import { HeaderItem, Icon, Typography } from "@ui-kit";
import { cn, formatAmount } from "@utils";

export const useTransactionHeaders = () => {
  const { id } = useParams({ from: "/auth/accounts/$type/$id" });

  const headers: HeaderItem[] = [
    {
      text: "asset",
      value: (item) =>
        typeof item.base === "object" && typeof item.base.currency === "string" ? (
          <div className="flex items-center gap-2">
            <img src={`/icons/currencies/${item.base.currency.toUpperCase()}.svg`} alt="" className="h-6 w-6" />
            {item.base.currency}
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "20%",
    },
    {
      text: "amount",
      value: (item) =>
        typeof item.base === "object" && typeof item.base.amount === "number" ? (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "grow",
                item.sign === "-"
                  ? "text-error-primary"
                  : item.sign === "+"
                    ? "text-success-primary"
                    : "text-foreground-secondary"
              )}
            >
              {typeof item.sign === "string" ? item.sign : ""}
              {formatAmount(item.base.amount)}
            </div>
            {item.quote &&
              typeof item.quote === "object" &&
              typeof item.quote.amount === "number" &&
              typeof item.quote.currency === "string" && (
                <Typography variant="body-sm" color="secondary">
                  {formatAmount(item.quote.amount)} {item.quote.currency}
                </Typography>
              )}
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "20%",
    },
    {
      text: "UID",
      value: (item) =>
        typeof item.from === "object" && typeof item.to === "object" && item.from.accountNumber === id
          ? (item.to.ownerId as string)
          : (item.from as { ownerId: string }).ownerId,
      width: "20%",
    },
    {
      text: "transaction ID",
      value: "orderId",
      width: "20%",
    },
    {
      text: "transaction type",
      value: (item) => typeof item.order === "string" && item.order.replace(/([a-z])([A-Z])/g, "$1 $2"),
      width: "20%",
    },
  ];

  return {
    headers,
  };
};
