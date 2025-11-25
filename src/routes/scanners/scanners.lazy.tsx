import { ScannersPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/scanners")({
  component: ScannersPage,
});
