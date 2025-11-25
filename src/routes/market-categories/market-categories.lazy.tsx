import { MarketCategoriesPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/market-categories")({
  component: MarketCategoriesPage,
});
