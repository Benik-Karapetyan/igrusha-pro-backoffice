import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const peerToPeerOrderDetailsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/peer-to-peer-orders/$id",
}).lazy(() => import("./peer-to-peer-order-details.consts").then((d) => d.Route));
