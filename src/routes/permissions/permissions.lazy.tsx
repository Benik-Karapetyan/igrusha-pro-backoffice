import { PermissionsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/permissions")({
  component: PermissionsPage,
});
