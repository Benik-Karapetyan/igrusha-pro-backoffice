import { CopyToClipboard } from "@containers";
import { TextCell, Typography } from "@ui-kit";

interface PaymentMethodDetailsCardProps {
  paymentMethod: string;
  accountHolderName: string;
  accountNumber: string;
  paymentDuration: string;
  accountInfo: string;
}

export const PaymentMethodDetailsCard = (props: PaymentMethodDetailsCardProps) => {
  const { paymentMethod, accountHolderName, accountNumber, paymentDuration, accountInfo } = props;

  return (
    <div className="flex flex-col gap-4 border-b border-dashed pb-4">
      <Typography variant="heading-4" color="secondary">
        Payment Method Details
      </Typography>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <TextCell
            title="Payment Method:"
            value={paymentMethod}
            appendInner={<CopyToClipboard text={paymentMethod} size="iconXSmall" />}
            className="w-[calc(25%_-_0.75rem)]"
          />
          <TextCell
            title="Account holder name:"
            value={accountHolderName}
            appendInner={<CopyToClipboard text={accountHolderName} size="iconXSmall" />}
            className="w-[calc(25%_-_0.75rem)]"
          />
          <TextCell
            title="Account number:"
            value={accountNumber}
            appendInner={<CopyToClipboard text={accountNumber} size="iconXSmall" />}
            className="w-[calc(25%_-_0.75rem)]"
          />
          <TextCell
            title="Payment duration:"
            value={paymentDuration}
            className="w-[calc(25%_-_0.75rem)]"
            hasBorder={false}
          />
        </div>

        <TextCell title="Account info:" value={accountInfo} className="w-full" hasBorder={false} />
      </div>
    </div>
  );
};
