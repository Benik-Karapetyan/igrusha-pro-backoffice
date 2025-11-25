import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const apiKeysRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/api-keys",
}).lazy(() => import("./api-keys.lazy").then((d) => d.Route));
