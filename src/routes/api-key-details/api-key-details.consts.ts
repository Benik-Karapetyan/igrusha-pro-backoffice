import { z } from "zod";

export const ApiKeyDetailsTabSchema = z
  .union([z.literal("overview"), z.literal("transactionMonitoring"), z.literal("auditLog")])
  .optional();

export type TApiKeyDetailsTabValue = z.infer<typeof ApiKeyDetailsTabSchema>;
