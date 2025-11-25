import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const levelsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/levels",
}).lazy(() => import("./levels.lazy").then((d) => d.Route));
