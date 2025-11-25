import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const customersRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/customers",
}).lazy(() => import("./customers.lazy").then((d) => d.Route));
