import { CopyToClipboard, OnChainTransactionStatusCell, TableActionsCell, TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { ENUM_ON_CHAIN_TRANSACTION_STATUS, TOnChainTransaction } from "@types";
import { HeaderItem, Icon, TableItem } from "@ui-kit";
import { formatAmount } from "@utils";

export const useOnChainTransactionHeaders = () => {
  const setSelectedOnChainTransaction = useStore((s) => s.setSelectedOnChainTransaction);

  const headers: HeaderItem[] = [
    {
      text: "transaction ID",
      value: (item: TableItem) =>
        typeof item.transactionId === "string" && (
          <div className="flex">
            <div className="overflow-hidden text-ellipsis" title={item.transactionId}>
              {item.transactionId}
            </div>
            <CopyToClipboard text={item.transactionId} size="iconSmall" />
          </div>
        ),
      width: 160,
      maxWidth: 160,
    },
    {
      text: "transaction type",
      value: "kind",
    },
    {
      text: "network",
      value: "network",
    },
    {
      text: "amount",
      value: (item) => (
        <div className="flex items-center gap-2">
          {typeof item.transactionAmount === "object" && typeof item.transactionAmount.amount === "string" ? (
            formatAmount(+item.transactionAmount.amount)
          ) : (
            <Icon name={mdiMinus} dense />
          )}

          {typeof item.transactionAmount === "object" && typeof item.transactionAmount.currency === "string" ? (
            <div className="flex items-center gap-2">{item.transactionAmount.currency}</div>
          ) : (
            <Icon name={mdiMinus} dense />
          )}
        </div>
      ),
    },
    { text: "risk level", value: "" },
    {
      text: "status",
      value: (item) =>
        typeof item.status === "string" && (
          <OnChainTransactionStatusCell status={item.status as ENUM_ON_CHAIN_TRANSACTION_STATUS} />
        ),
    },
    {
      text: "creation date",
      value: (item) => (
        <div className="flex items-center gap-1">
          {typeof item.createdAt === "string" && <TableDateCell date={item.createdAt} />}
          <TableActionsCell
            actions={["watch"]}
            item={item}
            onWatch={(item) => setSelectedOnChainTransaction(item as TOnChainTransaction)}
            className="ml-auto"
          />
        </div>
      ),
      width: "17%",
      maxWidth: "17%",
    },
  ];

  return {
    headers,
  };
};
