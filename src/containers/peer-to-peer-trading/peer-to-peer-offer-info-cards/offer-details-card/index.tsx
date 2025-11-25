import { TextCell, Typography } from "@ui-kit";

interface OfferDetailsCardProps {
  priceType: string;
  price: string;
  cryptoFiatPair: string;
  visibility: string;
  paymentMethods: string;
}

export const OfferDetailsCard = (props: OfferDetailsCardProps) => {
  const { priceType, price, cryptoFiatPair, visibility, paymentMethods } = props;

  return (
    <div className="flex flex-col gap-4 border-b border-dashed pb-4">
      <Typography variant="heading-4" color="secondary">
        Offer Details
      </Typography>

      <div className="flex flex-col gap-3">
        <TextCell
          variant="row"
          title="Price Type:"
          value={priceType}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Price:"
          value={price}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Crypto/Fiat Pair:"
          value={cryptoFiatPair}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Visibility:"
          value={visibility}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
        <TextCell
          variant="row"
          title="Payment Methods:"
          value={paymentMethods}
          className="w-full"
          restrictWidth={false}
          hasBorder={false}
        />
      </div>
    </div>
  );
};
