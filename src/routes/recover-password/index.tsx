import { createRoute } from "@tanstack/react-router";

import { rootRoute } from "../__root";

export const recoverPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recover-password",
}).lazy(() => import("./recover-password.lazy").then((d) => d.Route));
