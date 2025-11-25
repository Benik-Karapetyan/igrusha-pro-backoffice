import { SignInPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/sign-in")({
  component: SignInPage,
});
