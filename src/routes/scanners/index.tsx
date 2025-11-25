import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const scannersRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/scanners",
}).lazy(() => import("./scanners.lazy").then((d) => d.Route));
