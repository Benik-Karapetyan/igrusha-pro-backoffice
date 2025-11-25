import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";
import { DepositAnalyticsTabSchema } from "./deposit-analytics.consts";

export const depositAnalyticsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/deposit-analytics",
  validateSearch: z.object({
    tab: DepositAnalyticsTabSchema,
  }),
}).lazy(() => import("./deposit-analytics.lazy").then((d) => d.Route));
