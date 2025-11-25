import { createRoute, redirect } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const mainRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/products" });
  },
}).lazy(() => import("./main.lazy").then((d) => d.Route));
