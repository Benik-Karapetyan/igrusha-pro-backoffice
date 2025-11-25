import { AdminUserPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/admin-users/admin-user")({
  component: AdminUserPage,
});
