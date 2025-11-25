import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { rootRoute } from "../__root";

export const setPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/set-password",
  validateSearch: z.object({
    token: z.string().optional(),
    user: z.string().optional(),
  }),
  beforeLoad: ({ search }) => {
    if (!search.token || !search.user) {
      throw redirect({ to: "/sign-in", replace: true });
    }
  },
}).lazy(() => import("./set-password.lazy").then((d) => d.Route));
