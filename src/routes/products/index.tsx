import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const productsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/products",
}).lazy(() => import("./products.lazy").then((d) => d.Route));
