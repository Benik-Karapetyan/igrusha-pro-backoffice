import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const permissionsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/permissions",
}).lazy(() => import("./permissions.lazy").then((d) => d.Route));
