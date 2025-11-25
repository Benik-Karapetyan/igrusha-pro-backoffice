import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const nodesRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/nodes",
}).lazy(() => import("./nodes.lazy").then((d) => d.Route));
