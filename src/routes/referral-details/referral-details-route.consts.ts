import { z } from "zod";

export const ReferralDetailsTabSchema = z.union([z.literal("invitedUsers"), z.literal("totalEarning")]).optional();

export type TReferralDetailsTabValue = z.infer<typeof ReferralDetailsTabSchema>;
