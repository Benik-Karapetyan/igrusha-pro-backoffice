import { z } from "zod";

export const FeeSettingsTabSchema = z.union([z.literal("levelsFee"), z.literal("customFee")]).optional();

export type TFeeSettingsTabValue = z.infer<typeof FeeSettingsTabSchema>;
