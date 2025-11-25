import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";

export const adminUserRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/admin-users/admin-user",
  validateSearch: z.object({
    id: z.string().optional(),
  }),
}).lazy(() => import("./admin-user.lazy").then((d) => d.Route));
