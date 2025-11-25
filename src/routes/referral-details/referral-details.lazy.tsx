import { ReferralDetailsPage } from "@pages";
import { createLazyRoute } from "@tanstack/react-router";

export const Route = createLazyRoute("/auth/referral/$id")({
  component: ReferralDetailsPage,
});
