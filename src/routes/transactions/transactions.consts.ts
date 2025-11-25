import { z } from "zod";

export const TransactionsTabSchema = z.union([z.literal("onChain"), z.literal("onOffRampHistory")]).optional();

export type TTransactionsTabValue = z.infer<typeof TransactionsTabSchema>;
