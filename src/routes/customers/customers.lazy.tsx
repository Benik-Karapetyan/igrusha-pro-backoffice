import { CustomersPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/customers")({
  component: CustomersPage,
});
