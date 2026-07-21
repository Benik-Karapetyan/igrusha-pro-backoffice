import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";

export const procurementProductsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/procurement-products",
  validateSearch: z.object({
    page: z.coerce.number().int().positive().catch(1),
    pageSize: z.coerce.number().int().positive().catch(25),
  }),
}).lazy(() => import("./procurement-products.lazy").then((d) => d.Route));
