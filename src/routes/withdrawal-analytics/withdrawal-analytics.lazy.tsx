import { WithdrawalAnalyticsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/withdrawal-analytics")({
  component: WithdrawalAnalyticsPage,
});
