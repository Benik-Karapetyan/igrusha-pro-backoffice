import { PaymentHistoryPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/payment-history")({
  component: PaymentHistoryPage,
});
