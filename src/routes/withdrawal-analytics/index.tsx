import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";
import { WithdrawalAnalyticsTabSchema } from "./withdrawal-analytics.consts";

export const withdrawalAnalyticsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/withdrawal-analytics",
  validateSearch: z.object({
    tab: WithdrawalAnalyticsTabSchema,
  }),
}).lazy(() => import("./withdrawal-analytics.lazy").then((d) => d.Route));
