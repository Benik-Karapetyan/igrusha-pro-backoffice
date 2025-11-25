import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const smsProvidersRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/sms-providers",
}).lazy(() => import("./sms-providers.lazy").then((d) => d.Route));
