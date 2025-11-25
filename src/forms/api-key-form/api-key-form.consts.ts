import { z } from "zod";

export const apiKeyFormSchema = z.object({
  newRPS: z.number().min(0),
  key: z.string().optional(),
});

export type ApiKeyFormValues = z.infer<typeof apiKeyFormSchema>;
