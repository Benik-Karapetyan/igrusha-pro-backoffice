import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";

export const productsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/products",
  validateSearch: z.object({
    page: z.coerce.number().int().positive().catch(1),
    pageSize: z.coerce.number().int().positive().catch(25),
  }),
}).lazy(() => import("./products.lazy").then((d) => d.Route));
