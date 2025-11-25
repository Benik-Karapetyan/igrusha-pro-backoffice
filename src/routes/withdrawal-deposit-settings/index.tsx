import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const withdrawalDepositSettingsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/withdrawal-deposit-settings",
}).lazy(() => import("./withdrawal-deposit-settings.lazy").then((d) => d.Route));
