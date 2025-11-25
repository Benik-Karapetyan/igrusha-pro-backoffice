import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const adminUsersRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/admin-users",
}).lazy(() => import("./admin-users.lazy").then((d) => d.Route));
