import { AccountDetailsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/accounts/$type/$id")({
  component: AccountDetailsPage,
});
