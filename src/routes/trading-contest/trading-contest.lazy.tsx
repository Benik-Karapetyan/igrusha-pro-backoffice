import { TradingContestPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/trading-contest")({
  component: TradingContestPage,
});
