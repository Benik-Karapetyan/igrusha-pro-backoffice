import { z } from "zod";

export const DepositAnalyticsTabSchema = z.union([z.literal("byAsset"), z.literal("network")]).optional();

export type TDepositAnalyticsTabValue = z.infer<typeof DepositAnalyticsTabSchema>;
