import { ProfilePage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/profile")({
  component: ProfilePage,
});
