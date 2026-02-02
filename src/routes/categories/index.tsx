import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const categoriesRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/categories",
}).lazy(() => import("./categories.lazy").then((d) => d.Route));
