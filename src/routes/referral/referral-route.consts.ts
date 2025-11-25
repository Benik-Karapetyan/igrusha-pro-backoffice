import { z } from "zod";

export const ReferralTabSchema = z
  .union([z.literal("levelConfig"), z.literal("userManagement"), z.literal("withdrawalThreshold")])
  .optional();

export type TReferralTabValue = z.infer<typeof ReferralTabSchema>;
