import { SpotTradingPairsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/spot-trading-pairs")({
  component: SpotTradingPairsPage,
});
