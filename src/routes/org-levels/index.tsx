import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const orgLevelsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/org-levels",
}).lazy(() => import("./org-levels.lazy").then((d) => d.Route));
