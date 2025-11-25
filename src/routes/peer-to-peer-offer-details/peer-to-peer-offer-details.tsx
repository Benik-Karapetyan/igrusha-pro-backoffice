import { PeerToPeerOfferDetailsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/peer-to-peer-offers/$id")({
  component: PeerToPeerOfferDetailsPage,
});
