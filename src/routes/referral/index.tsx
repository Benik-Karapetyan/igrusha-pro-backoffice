import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";
import { ReferralTabSchema } from "./referral-route.consts";

export const referralRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/referral",
  validateSearch: z.object({
    tab: ReferralTabSchema,
  }),
}).lazy(() => import("./referral.lazy").then((d) => d.Route));
