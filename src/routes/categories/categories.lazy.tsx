import { CategoriesPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/categories")({
  component: CategoriesPage,
});
