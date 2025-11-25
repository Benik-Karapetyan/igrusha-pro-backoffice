import { OnOffRampHistoryGroupedStatusCell, TableActionsCell, TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { ENUM_ON_OFF_RAMP_TRANSACTION_TYPE, TOnOffRampTransaction } from "@types";
import { HeaderItem, Icon, Typography } from "@ui-kit";
import { convertScientificToDecimal } from "@utils";

export const useOnOffRampHistoryHeaders = () => {
  const setSelectedOnOffRampTransaction = useStore((s) => s.setSelectedOnOffRampTransaction);

  const getTransactionTypeText = (transactionType: number) => {
    switch (transactionType) {
      case ENUM_ON_OFF_RAMP_TRANSACTION_TYPE.OnRamp:
        return "On Ramp";
      case ENUM_ON_OFF_RAMP_TRANSACTION_TYPE.OffRamp:
        return "Off Ramp";
      case ENUM_ON_OFF_RAMP_TRANSACTION_TYPE.Refund:
        return "Refund";
      default:
        return <Icon name={mdiMinus} dense />;
    }
  };

  const headers: HeaderItem[] = [
    {
      text: "order ID",
      value: "id",
      width: "17%",
      maxWidth: "17%",
    },
    {
      text: "transaction type",
      value: (item) =>
        typeof item.orderType === "number" ? getTransactionTypeText(item.orderType) : <Icon name={mdiMinus} dense />,
      width: "17%",
      maxWidth: "17%",
    },
    {
      text: "currency",
      value: (item) => (
        <div className="flex items-center justify-between gap-2">
          {typeof item.currency === "string" && typeof item.commissionFee === "number" ? (
            `${convertScientificToDecimal(item.commissionFee)} ${item.currency}`
          ) : (
            <Icon name={mdiMinus} dense />
          )}

          {typeof item.equivalentAmount === "number" && typeof item.fiatCurrency === "string" ? (
            <Typography variant="body-sm" color="secondary">
              {`${convertScientificToDecimal(item.equivalentAmount)} ${item.fiatCurrency}`}
            </Typography>
          ) : (
            <Icon name={mdiMinus} dense />
          )}
        </div>
      ),
      width: "17%",
      maxWidth: "17%",
    },
    { text: "payment provider", value: "paymentProviderName", width: "17%", maxWidth: "17%" },
    {
      text: "status",
      value: (item) =>
        typeof item?.orderStatusGrouped === "number" && (
          <OnOffRampHistoryGroupedStatusCell status={item.orderStatusGrouped} />
        ),
      width: "17%",
      maxWidth: "17%",
    },
    {
      text: "creation date",
      value: (item) => (
        <div className="flex items-center gap-1">
          {typeof item.createDate === "string" && <TableDateCell date={item.createDate} />}
          <TableActionsCell
            actions={["watch"]}
            item={item}
            onWatch={(item) => setSelectedOnOffRampTransaction(item as TOnOffRampTransaction)}
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
