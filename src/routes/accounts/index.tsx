import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const accountsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/accounts",
}).lazy(() => import("./accounts.lazy").then((d) => d.Route));
