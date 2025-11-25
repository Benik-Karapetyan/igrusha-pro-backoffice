import { TradingHistoryPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/trading-history")({
  component: TradingHistoryPage,
});
