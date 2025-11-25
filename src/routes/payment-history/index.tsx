import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const paymentHistoryRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/payment-history",
}).lazy(() => import("./payment-history.lazy").then((d) => d.Route));
