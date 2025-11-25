import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const marketCategoriesRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/market-categories",
}).lazy(() => import("./market-categories.lazy").then((d) => d.Route));
