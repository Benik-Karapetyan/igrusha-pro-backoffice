import { VaultsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/vaults")({
  component: VaultsPage,
});
