import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const peerToPeerOrdersRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/peer-to-peer-orders",
}).lazy(() => import("./peer-to-peer-orders.lazy").then((d) => d.Route));
