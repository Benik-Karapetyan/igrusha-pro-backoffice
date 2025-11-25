import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const spotTradingPairsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/spot-trading-pairs",
}).lazy(() => import("./spot-trading-pairs.lazy").then((d) => d.Route));
