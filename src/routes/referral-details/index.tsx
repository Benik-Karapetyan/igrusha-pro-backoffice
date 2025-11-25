import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";
import { ReferralDetailsTabSchema } from "./referral-details-route.consts";

export const referralDetailsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/referral/$id",
  validateSearch: z.object({
    tab: ReferralDetailsTabSchema,
  }),
}).lazy(() => import("./referral-details.lazy").then((d) => d.Route));
