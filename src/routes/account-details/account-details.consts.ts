import { z } from "zod";

export const AccountDetailsTabSchema = z.union([z.literal("balances"), z.literal("transactions")]).optional();

export type TAccountDetailsTabValue = z.infer<typeof AccountDetailsTabSchema>;
