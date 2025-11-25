import { RecoverPasswordPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/recover-password")({
  component: RecoverPasswordPage,
});
