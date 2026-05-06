import { UtilizedProductsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/utilized-products")({
  component: UtilizedProductsPage,
});
