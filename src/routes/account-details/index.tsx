import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";
import { AccountDetailsTabSchema } from "./account-details.consts";

export const accountDetailsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/accounts/$type/$id",
  validateSearch: z.object({
    accountName: z.string().optional(),
    tab: AccountDetailsTabSchema,
  }),
}).lazy(() => import("./account-details.lazy").then((d) => d.Route));
