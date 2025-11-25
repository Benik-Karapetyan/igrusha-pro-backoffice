import { SmsProvidersPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/sms-providers")({
  component: SmsProvidersPage,
});
