import { NetworksPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/networks")({
  component: NetworksPage,
});
