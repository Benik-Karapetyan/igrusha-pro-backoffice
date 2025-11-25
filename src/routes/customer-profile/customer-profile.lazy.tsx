import { CustomerProfilePage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/customers/$id")({
  component: CustomerProfilePage,
});
