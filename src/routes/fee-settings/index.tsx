import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";
import { FeeSettingsTabSchema } from "./fee-settings.consts";

export const feeSettingsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/fee-settings",
  validateSearch: z.object({
    tab: FeeSettingsTabSchema,
  }),
}).lazy(() => import("./fee-settings.lazy").then((d) => d.Route));
