import { PeerToPeerOrdersPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/peer-to-peer-orders")({
  component: PeerToPeerOrdersPage,
});
