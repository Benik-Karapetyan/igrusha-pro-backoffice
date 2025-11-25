import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const coinsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/coins",
}).lazy(() => import("./coins.lazy").then((d) => d.Route));
