import { OrdersPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/orders")({
  component: OrdersPage,
});
