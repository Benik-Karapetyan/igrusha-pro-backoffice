import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const vaultsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/vaults",
}).lazy(() => import("./vaults.lazy").then((d) => d.Route));
