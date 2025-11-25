import { RolePage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/roles/role")({
  component: RolePage,
});
