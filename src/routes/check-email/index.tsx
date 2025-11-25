import { createRoute } from "@tanstack/react-router";

import { rootRoute } from "../__root";

export const checkEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/check-email",
}).lazy(() => import("./check-email.lazy").then((d) => d.Route));
