import { PermissionSectionsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/permission-sections")({
  component: PermissionSectionsPage,
});
