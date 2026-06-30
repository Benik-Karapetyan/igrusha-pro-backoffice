import { BrandsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/brands")({
  component: BrandsPage,
});
