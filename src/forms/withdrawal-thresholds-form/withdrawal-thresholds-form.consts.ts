import { z } from "zod";

const WithdrawalThresholdSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  assetId: z.number().positive().nullable(),
  amount: z
    .number()
    .positive("Min value must be greater than or equal to 0")
    .or(z.literal(0))
    .or(z.string().min(1, "Min payout is required")),
});

export const WithdrawalThresholdsFormSchema = z.object({
  assets: WithdrawalThresholdSchema.array(),
});

export type WithdrawalThresholdsFormValues = z.infer<typeof WithdrawalThresholdsFormSchema>;
export type WithdrawalThresholdValues = z.infer<typeof WithdrawalThresholdSchema>;

export const emptyWithdrawalThresholdItem: WithdrawalThresholdValues = {
  name: "",
  assetId: null,
  amount: "",
};

export const emptyWithdrawalThresholds: WithdrawalThresholdsFormValues = {
  assets: [emptyWithdrawalThresholdItem],
};
