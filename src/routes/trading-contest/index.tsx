import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const tradingContestRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/trading-contest",
}).lazy(() => import("./trading-contest.lazy").then((d) => d.Route));
