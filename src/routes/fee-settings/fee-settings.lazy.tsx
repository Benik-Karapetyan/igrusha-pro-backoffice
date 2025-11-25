import { FeeSettingsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/fee-settings")({
  component: FeeSettingsPage,
});
