import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";

export const utilizedProductsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/utilized-products",
  validateSearch: z.object({
    page: z.coerce.number().int().positive().catch(1),
    pageSize: z.coerce.number().int().positive().catch(10),
  }),
}).lazy(() => import("./utilized-products.lazy").then((d) => d.Route));
