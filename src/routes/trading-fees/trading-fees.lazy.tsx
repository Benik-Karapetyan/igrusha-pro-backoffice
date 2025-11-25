import { TradingFeesPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/trading-fees")({
  component: TradingFeesPage,
});
