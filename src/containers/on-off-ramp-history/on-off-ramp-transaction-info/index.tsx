import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { ENUM_ON_OFF_RAMP_TRANSACTION_TYPE } from "@types";
import { Icon, TextCell } from "@ui-kit";
import { formatAmount } from "@utils";

import { OnOffRampHistoryStatusCell } from "..";
import { CopyToClipboard } from "../../copy-to-clipboard";

export const OnOffRampTransactionInfo = () => {
  const selectedOnOffRampTransaction = useStore((s) => s.selectedOnOffRampTransaction);

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

  return (
    selectedOnOffRampTransaction && (
      <div className="flex flex-col gap-4 border-b border-dashed pb-4">
        <div className="flex gap-4">
          <TextCell
            title="Transaction Type"
            value={getTransactionTypeText(selectedOnOffRampTransaction.orderType)}
            className="w-[calc(50%_-_0.5rem)]"
          />
          <TextCell
            title="Detailed Status"
            value={<OnOffRampHistoryStatusCell status={selectedOnOffRampTransaction.status} />}
            hasBorder={false}
            className="w-[calc(50%_-_0.5rem)]"
          />
        </div>

        <div className="flex gap-4">
          <TextCell
            title="Initial Amount"
            value={`${formatAmount(selectedOnOffRampTransaction.amount)} ${selectedOnOffRampTransaction.fiatCurrency}`}
            className="w-[calc(50%_-_0.5rem)]"
          />

          <TextCell
            title="Deposit Amount"
            value={`${formatAmount(selectedOnOffRampTransaction.cryptoAmount)} ${selectedOnOffRampTransaction.currency}`}
            hasBorder={false}
            className="w-[calc(50%_-_0.5rem)]"
          />
        </div>

        <div className="flex gap-4">
          <TextCell
            title="Comission Fee"
            value={`${formatAmount(selectedOnOffRampTransaction.commissionFee)} ${selectedOnOffRampTransaction.fiatCurrency}`}
            className="w-[calc(50%_-_0.5rem)]"
          />
          <TextCell
            title="Crypto Price"
            value={`${formatAmount(selectedOnOffRampTransaction.cryptoPrice)} ${selectedOnOffRampTransaction.currency}`}
            className="w-[calc(50%_-_0.5rem)]"
          />
        </div>

        <TextCell
          title="Transaction Hash"
          value={selectedOnOffRampTransaction.cryptoHash}
          appendInner={<CopyToClipboard text={selectedOnOffRampTransaction.cryptoHash} size="iconXSmall" />}
          className="w-[calc(50%_-_0.5rem)]"
        />

        <div className="flex gap-4">
          <TextCell
            title="Provider Name"
            value={selectedOnOffRampTransaction.paymentProviderName}
            className="w-[calc(50%_-_0.5rem)]"
          />
          <TextCell
            title="Provider Order ID"
            value={selectedOnOffRampTransaction.providerOrderId}
            appendInner={<CopyToClipboard text={selectedOnOffRampTransaction.providerOrderId} size="iconXSmall" />}
            hasBorder={false}
            className="w-[calc(50%_-_0.5rem)]"
          />
        </div>

        <div className="flex gap-4">
          <TextCell
            title="Card/Account Holder Name"
            value={selectedOnOffRampTransaction.accountInfo.name}
            appendInner={<CopyToClipboard text={selectedOnOffRampTransaction.accountInfo.name} size="iconXSmall" />}
            className="w-[calc(50%_-_0.5rem)]"
          />
          <TextCell
            title="Card/Account Number"
            value={selectedOnOffRampTransaction.accountInfo.account}
            hasBorder={false}
            className="w-[calc(50%_-_0.5rem)]"
          />
        </div>
      </div>
    )
  );
};
