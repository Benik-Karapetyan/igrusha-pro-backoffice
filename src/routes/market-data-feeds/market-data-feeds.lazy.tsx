import { MarketDataFeedsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/market-data-feeds")({
  component: MarketDataFeedsPage,
});
