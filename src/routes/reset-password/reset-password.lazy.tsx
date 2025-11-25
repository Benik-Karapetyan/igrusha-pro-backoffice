import { ResetPasswordPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/reset-password")({
  component: ResetPasswordPage,
});
