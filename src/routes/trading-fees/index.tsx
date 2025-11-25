import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const tradingFeesRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/trading-fees",
}).lazy(() => import("./trading-fees.lazy").then((d) => d.Route));
