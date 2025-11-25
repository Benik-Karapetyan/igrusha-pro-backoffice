import { z } from "zod";

export const AlertCenterTabSchema = z.literal("onChainTransactions").optional();
export const OnChainTransactionsTabSchema = z.union([z.literal("transactions"), z.literal("settings")]).optional();

export type TAlertCenterTabValue = z.infer<typeof AlertCenterTabSchema>;
export type TOnChainTransactionsTabValue = z.infer<typeof OnChainTransactionsTabSchema>;
