import { OrgLevelsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/org-levels")({
  component: OrgLevelsPage,
});
