import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";
import { AlertCenterTabSchema, OnChainTransactionsTabSchema } from "./alert-center.consts";

export const alertCenterRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/alert-center",
  validateSearch: z.object({
    tab: AlertCenterTabSchema,
    onChainTransactionsTab: OnChainTransactionsTabSchema,
  }),
}).lazy(() => import("./alert-center.lazy").then((d) => d.Route));
