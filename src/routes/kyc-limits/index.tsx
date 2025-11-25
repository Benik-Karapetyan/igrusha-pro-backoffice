import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const kycLimitsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/kyc-limits",
}).lazy(() => import("./kyc-limits.lazy").then((d) => d.Route));
