import { CopyToClipboard } from "@containers";
import { ChipTypes, TextCell, Typography } from "@ui-kit";

interface OrderInfoCardProps {
  orderId: string;
  offerId: string;
  orderType: string;
  chipType: ChipTypes;
  chipTitle: string;
  appeal: string;
  orderDuration: string;
  creationTime: string;
  lastStatusUpdate: string;
  cryptoAmount: string;
  price: string;
  fiatAmount: string;
}

export const OrderInfoCard = (props: OrderInfoCardProps) => {
  const {
    orderId,
    offerId,
    orderType,
    chipType,
    chipTitle,
    appeal,
    orderDuration,
    creationTime,
    lastStatusUpdate,
    cryptoAmount,
    price,
    fiatAmount,
  } = props;

  return (
    <div className="flex flex-col gap-4 border-b border-dashed pb-4">
      <Typography variant="heading-4" color="secondary">
        Order Info
      </Typography>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <TextCell
            title="Order ID:"
            value={orderId}
            appendInner={<CopyToClipboard text={orderId} size="iconXSmall" />}
            className="w-[calc(25%_-_0.75rem)]"
          />
          <TextCell
            title="Offer ID:"
            value={offerId}
            appendInner={<CopyToClipboard text={offerId} size="iconXSmall" />}
            className="w-[calc(25%_-_0.75rem)]"
          />
          <TextCell title="Order Type:" value={orderType} className="w-[calc(25%_-_0.75rem)]" />
          <TextCell
            title="Status:"
            chipType={chipType}
            chipTitle={chipTitle}
            className="w-[calc(25%_-_0.75rem)]"
            hasBorder={false}
          />
        </div>

        <div className="flex gap-4">
          <TextCell
            title="Appeal:"
            value={appeal}
            appendInner={<CopyToClipboard text={appeal} size="iconXSmall" />}
            className="w-[calc(25%_-_0.75rem)]"
          />
          <TextCell title="Order duration:" value={orderDuration} className="w-[calc(25%_-_0.75rem)]" />
          <TextCell title="Creation Time:" value={creationTime} className="w-[calc(25%_-_0.75rem)]" />
          <TextCell
            title="Last status update:"
            value={lastStatusUpdate}
            className="w-[calc(25%_-_0.75rem)]"
            hasBorder={false}
          />
        </div>

        <div className="flex gap-4">
          <TextCell title="Crypto amount:" value={cryptoAmount} className="w-[calc(25%_-_0.75rem)]" />
          <TextCell title="Price (fixed):" value={price} className="w-[calc(25%_-_0.75rem)]" />
          <TextCell title="Fiat Amount:" value={fiatAmount} className="w-[calc(25%_-_0.75rem)]" hasBorder={false} />
        </div>
      </div>
    </div>
  );
};
