import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const usersRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/users",
}).lazy(() => import("./users.lazy").then((d) => d.Route));
