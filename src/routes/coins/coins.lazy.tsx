import { CoinsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/coins")({
  component: CoinsPage,
});
