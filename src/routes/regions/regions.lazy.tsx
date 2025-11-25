import { RegionsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/regions")({
  component: RegionsPage,
});
