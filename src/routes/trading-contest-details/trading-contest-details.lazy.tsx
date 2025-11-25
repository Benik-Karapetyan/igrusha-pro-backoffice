import { TradingContestDetailsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/trading-contest/$id")({
  component: TradingContestDetailsPage,
});
