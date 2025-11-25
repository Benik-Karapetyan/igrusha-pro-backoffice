import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const tradingHistoryRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/trading-history",
}).lazy(() => import("./trading-history.lazy").then((d) => d.Route));
