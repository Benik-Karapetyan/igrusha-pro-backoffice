import { createRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

import { rootRoute } from "../__root";

export const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sign-in",
  validateSearch: z.object({
    redirect: z.string().optional(),
    from: z.string().optional(),
  }),
  beforeLoad: ({ context: { auth } }) => {
    if (auth)
      throw redirect({
        to: "/products",
      });
  },
}).lazy(() => import("./sign-in.lazy").then((d) => d.Route));
