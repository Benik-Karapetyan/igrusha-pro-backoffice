import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { Icon, TextCell } from "@ui-kit";
import { formatAmount } from "@utils";
import { format } from "date-fns";

import { CopyToClipboard } from "../../copy-to-clipboard";

export const OnChainTransactionInfo = () => {
  const selectedOnChainTransaction = useStore((s) => s.selectedOnChainTransaction);

  return (
    selectedOnChainTransaction && (
      <div className="flex flex-col gap-4 border-b border-dashed pb-4">
        <div className="flex gap-4">
          <TextCell
            title="Transaction Type"
            value={selectedOnChainTransaction.kind}
            className="w-[calc(33.3333%_-_1rem)]"
          />

          <TextCell title="Network" value={selectedOnChainTransaction.network} className="w-[calc(33.3333%_-_1rem)]" />

          <TextCell
            title="Amount"
            value={`${formatAmount(+selectedOnChainTransaction.transactionAmount.amount)} ${selectedOnChainTransaction.transactionAmount.currency}`}
            hasBorder={false}
            className="w-[calc(33.3333%_-_1rem)]"
          />
        </div>

        <div className="flex gap-4">
          <TextCell
            title="Before Balance"
            value={<Icon name={mdiMinus} dense />}
            className="w-[calc(33.3333%_-_1rem)]"
          />

          <TextCell
            title="After Balance"
            value={<Icon name={mdiMinus} dense />}
            className="w-[calc(33.3333%_-_1rem)]"
          />

          <TextCell
            title="Transaction Hash"
            value={selectedOnChainTransaction.transactionHash}
            appendInner={<CopyToClipboard text={selectedOnChainTransaction.transactionHash} size="iconXSmall" />}
            hasBorder={false}
            className="w-[calc(33.3333%_-_1rem)]"
          />
        </div>

        <div className="flex gap-4">
          <TextCell
            title="Address From"
            value={selectedOnChainTransaction.addressFrom}
            appendInner={<CopyToClipboard text={selectedOnChainTransaction.addressFrom} size="iconXSmall" />}
            className="w-[calc(33.3333%_-_1rem)]"
          />

          <TextCell
            title="Address To"
            value={selectedOnChainTransaction.addressTo}
            appendInner={<CopyToClipboard text={selectedOnChainTransaction.addressTo} size="iconXSmall" />}
            className="w-[calc(33.3333%_-_1rem)]"
          />

          <TextCell
            title="Memo/Tag"
            value={selectedOnChainTransaction.memo || <Icon name={mdiMinus} dense />}
            appendInner={
              selectedOnChainTransaction.memo ? (
                <CopyToClipboard text={selectedOnChainTransaction.memo} size="iconXSmall" />
              ) : undefined
            }
            hasBorder={false}
            className="w-[calc(33.3333%_-_1rem)]"
          />
        </div>

        <div className="flex gap-4">
          <TextCell
            title="Fee Amount Freedx"
            value={
              selectedOnChainTransaction.feeInternal?.amount ? (
                `${formatAmount(+selectedOnChainTransaction.feeInternal.amount)} ${selectedOnChainTransaction.feeInternal.currency}`
              ) : (
                <Icon name={mdiMinus} dense />
              )
            }
            className="w-[calc(33.3333%_-_1rem)]"
          />

          <TextCell
            title="Fee Amount Third-Party"
            value={
              selectedOnChainTransaction.feeThirdParty?.amount ? (
                `${formatAmount(+selectedOnChainTransaction.feeThirdParty.amount)} ${selectedOnChainTransaction.feeThirdParty.currency}`
              ) : (
                <Icon name={mdiMinus} dense />
              )
            }
            className="w-[calc(33.3333%_-_1rem)]"
          />

          <TextCell
            title="Provider"
            value={selectedOnChainTransaction.provider || <Icon name={mdiMinus} dense />}
            hasBorder={false}
            className="w-[calc(33.3333%_-_1rem)]"
          />
        </div>

        <div className="flex gap-4">
          <TextCell
            title="Creation Date"
            value={format(selectedOnChainTransaction.createdAt, "yyyy.MM.dd HH:mm:ss")}
            className="w-[calc(33.3333%_-_1rem)]"
          />

          <TextCell
            title="Update Date"
            value={
              selectedOnChainTransaction.updatedAt ? (
                format(selectedOnChainTransaction.updatedAt, "yyyy.MM.dd HH:mm:ss")
              ) : (
                <Icon name={mdiMinus} dense />
              )
            }
            className="w-[calc(33.3333%_-_1rem)]"
          />
        </div>
      </div>
    )
  );
};
