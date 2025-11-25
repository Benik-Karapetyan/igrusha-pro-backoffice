import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const marketDataFeedsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/market-data-feeds",
}).lazy(() => import("./market-data-feeds.lazy").then((d) => d.Route));
