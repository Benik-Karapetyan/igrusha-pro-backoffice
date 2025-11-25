import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const tradingContestDetailsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/trading-contest/$id",
}).lazy(() => import("./trading-contest-details.lazy").then((d) => d.Route));
