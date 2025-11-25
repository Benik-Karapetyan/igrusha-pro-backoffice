import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const profileRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/profile",
}).lazy(() => import("./profile.lazy").then((d) => d.Route));
