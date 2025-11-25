import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const orderHistoryRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/order-history",
}).lazy(() => import("./order-history.lazy").then((d) => d.Route));
