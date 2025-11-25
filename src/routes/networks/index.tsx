import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const networksRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/networks",
}).lazy(() => import("./networks.lazy").then((d) => d.Route));
