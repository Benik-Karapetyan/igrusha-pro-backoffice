import { AppHeader } from "@containers";
import { PeerToPeerOfferInfoCards, PeerToPeerOfferOrders } from "@containers";
import { useParams } from "@tanstack/react-router";
import { Button } from "@ui-kit";

export const PeerToPeerOfferDetailsPage = () => {
  const { id } = useParams({ from: "/auth/peer-to-peer-offers/$id" });

  return (
    <div>
      <AppHeader
        title={id}
        backUrl="/peer-to-peer-offers"
        MainButton={<Button variant="critical">Deactivate Offer</Button>}
      />

      <div className="flex gap-4 p-4">
        <PeerToPeerOfferInfoCards />

        <PeerToPeerOfferOrders />
      </div>
    </div>
  );
};
