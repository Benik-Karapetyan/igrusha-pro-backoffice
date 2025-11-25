import { WithdrawalDepositSettingsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/withdrawal-deposit-settings")({
  component: WithdrawalDepositSettingsPage,
});
