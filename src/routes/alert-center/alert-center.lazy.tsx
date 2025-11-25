import { AlertCenterPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/alert-center")({
  component: AlertCenterPage,
});
