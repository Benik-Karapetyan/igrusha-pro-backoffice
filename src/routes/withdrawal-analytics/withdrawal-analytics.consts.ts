import { z } from "zod";

export const WithdrawalAnalyticsTabSchema = z.union([z.literal("byAsset"), z.literal("network")]).optional();

export type TWithdrawalAnalyticsTabValue = z.infer<typeof WithdrawalAnalyticsTabSchema>;
