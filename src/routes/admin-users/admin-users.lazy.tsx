import { AdminUsersPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/admin-users")({
  component: AdminUsersPage,
});
