import { AssetsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/assets")({
  component: AssetsPage,
});
