import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const brandsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/brands",
}).lazy(() => import("./brands.lazy").then((d) => d.Route));
