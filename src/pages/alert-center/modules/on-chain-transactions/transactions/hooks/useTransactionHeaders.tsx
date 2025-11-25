import { AlertCenterOnChainDecisionStatusCell, CopyToClipboard, TableActionsCell, TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS } from "@types";
import { HeaderItem, Icon, TableItem } from "@ui-kit";
import { formatScientificToFullNumber } from "@utils";

export const useTransactionHeaders = () => {
  const setSelectedAlertTransactionId = useStore((s) => s.setSelectedAlertTransactionId);

  const headers: HeaderItem[] = [
    {
      text: "transaction ID",
      value: (item: TableItem) =>
        typeof item.transactionId === "string" && (
          <div className="flex items-center p-0.5">
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
      text: "customer ID",
      value: (item: TableItem) =>
        typeof item.customerId === "string" && (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.customerId}>
              {item.customerId}
            </div>
            <CopyToClipboard text={item.customerId} size="iconSmall" />
          </div>
        ),
      width: 160,
      maxWidth: 160,
    },
    { text: "transaction type", value: "type", width: 160, maxWidth: 160 },
    {
      text: "amount",
      value: (item) =>
        typeof item.amount === "string" && typeof item.currency === "string" ? (
          `${formatScientificToFullNumber(+item.amount)} ${item.currency}`
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 210,
      maxWidth: 210,
    },
    { text: "risk level", value: "riskLevel", width: 155, maxWidth: 155 },
    {
      text: "review result",
      value: (item) =>
        typeof item?.status === "string" && (
          <AlertCenterOnChainDecisionStatusCell status={item.status as ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS} />
        ),
      width: 155,
      maxWidth: 155,
    },
    {
      text: "trigger status",
      value: "reviewStatus",
      width: 115,
      maxWidth: 115,
    },
    {
      text: "transaction date",
      value: (item) => (
        <div className="flex items-center gap-1">
          {item.transactionDate && typeof item.transactionDate === "string" && (
            <TableDateCell date={item.transactionDate} />
          )}
          <TableActionsCell
            actions={["watch"]}
            item={item}
            onWatch={(item) => setSelectedAlertTransactionId(item.id as string)}
            className="ml-auto"
          />
        </div>
      ),
      width: 160,
      maxWidth: 160,
    },
  ];

  return {
    headers,
  };
};
