import { ENUM_VERIFICATION_TRIGGER_TYPE } from "@types";
import { z } from "zod";

const VerificationTriggerTypeSchema = z.union([
  z.literal(ENUM_VERIFICATION_TRIGGER_TYPE.None),
  z.literal(ENUM_VERIFICATION_TRIGGER_TYPE.Kyc),
  z.literal(ENUM_VERIFICATION_TRIGGER_TYPE.Deposit),
]);

const VerificationTriggerSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
  type: VerificationTriggerTypeSchema,
  status: z.number(),
  enabled: z.boolean(),
  amount: z.number().positive("Min value must be greater than 0").or(z.null()).optional(),
});

export const VerificationTriggersFormSchema = z.object({
  triggers: VerificationTriggerSchema.array(),
});

export type VerificationTriggersFormValues = z.infer<typeof VerificationTriggersFormSchema>;

export const emptyVerificationTriggers: VerificationTriggersFormValues = {
  triggers: [],
};
