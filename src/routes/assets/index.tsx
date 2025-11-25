import { AssetsPage } from "@pages";
import { createRoute } from "@tanstack/react-router";

import { authRoute } from "../auth";

export const assetsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/assets",
  component: AssetsPage,
});
