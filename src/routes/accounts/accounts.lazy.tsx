import { AccountsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/accounts")({
  component: AccountsPage,
});
