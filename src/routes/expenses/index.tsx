import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const expensesRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/expenses",
}).lazy(() => import("./expenses.lazy").then((d) => d.Route));
