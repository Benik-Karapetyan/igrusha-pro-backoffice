import { CheckEmailPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/check-email")({
  component: CheckEmailPage,
});
