import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const peerToPeerOffersRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/peer-to-peer-offers",
}).lazy(() => import("./peer-to-peer-offers.lazy").then((d) => d.Route));
