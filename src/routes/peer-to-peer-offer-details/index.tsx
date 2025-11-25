import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const peerToPeerOfferDetailsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/peer-to-peer-offers/$id",
}).lazy(() => import("./peer-to-peer-offer-details").then((d) => d.Route));
