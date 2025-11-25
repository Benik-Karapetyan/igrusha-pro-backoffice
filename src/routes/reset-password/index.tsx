import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { rootRoute } from "../__root";

export const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reset-password",
  validateSearch: z.object({
    token: z.string().optional(),
    user: z.string().optional(),
  }),
  beforeLoad: ({ search }) => {
    if (!search.token || !search.user) {
      throw redirect({ to: "/sign-in", replace: true });
    }
  },
}).lazy(() => import("./reset-password.lazy").then((d) => d.Route));
