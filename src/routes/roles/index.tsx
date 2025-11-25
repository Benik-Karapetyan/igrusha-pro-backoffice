import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const rolesRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/roles",
}).lazy(() => import("./roles.lazy").then((d) => d.Route));
