import { ProductsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/products")({
  component: ProductsPage,
});
