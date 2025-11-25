import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";
import { TransactionsTabSchema } from "./transactions.consts";

export const transactionsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/transactions",
  validateSearch: z.object({
    tab: TransactionsTabSchema,
  }),
}).lazy(() => import("./transactions.lazy").then((d) => d.Route));
