import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const ordersRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/orders",
}).lazy(() => import("./orders.lazy").then((d) => d.Route));
