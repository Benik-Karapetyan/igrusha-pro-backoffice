import { TransactionsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/transactions")({
  component: TransactionsPage,
});
