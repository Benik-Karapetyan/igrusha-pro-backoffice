import { z } from "zod";

export const SmsProviderFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  locationIds: z.number().array(),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export type SmsProviderFormValues = z.infer<typeof SmsProviderFormSchema>;

export const emptySmsProvider: SmsProviderFormValues = {
  name: "",
  description: "",
  locationIds: [],
  status: 1,
};
