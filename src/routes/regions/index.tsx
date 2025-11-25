import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const regionsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/regions",
}).lazy(() => import("./regions.lazy").then((d) => d.Route));
