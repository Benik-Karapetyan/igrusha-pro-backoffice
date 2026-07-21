import { ProcurementProductsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/procurement-products")({
  component: ProcurementProductsPage,
});
