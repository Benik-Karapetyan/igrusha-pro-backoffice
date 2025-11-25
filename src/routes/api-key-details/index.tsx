import { createRoute } from "@tanstack/react-router";
import { z } from "zod";

import { authRoute } from "../auth";
import { ApiKeyDetailsTabSchema } from "./api-key-details.consts.ts";

export const apiKeyDetailsRoute = createRoute({
  getParentRoute: () => authRoute,
  path: "/api-keys/$id",
  validateSearch: z.object({
    tab: ApiKeyDetailsTabSchema,
    key: z.string().optional(),
  }),
}).lazy(() => import("./api-key-details.lazy.tsx").then((d) => d.Route));
