import { OrderHistoryPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/order-history")({
  component: OrderHistoryPage,
});
