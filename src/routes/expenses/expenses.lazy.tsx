import { ExpensesPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/expenses")({
  component: ExpensesPage,
});
