import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";

export const roleRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/roles/role",
  validateSearch: z.object({
    id: z.string().optional(),
  }),
}).lazy(() => import("./role.lazy").then((d) => d.Route));
