import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const permissionSectionsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/permission-sections",
}).lazy(() => import("./permission-sections.lazy").then((d) => d.Route));
