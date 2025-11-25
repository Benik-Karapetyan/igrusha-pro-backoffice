import { z } from "zod";

export const WithdrawAssetFormSchema = z.object({
  address: z.string().min(1, "Address is required"),
  amount: z.number().positive("Min value must be greater than 0").or(z.string().min(1, "Amount is required")),
  seedPhrase: z.string().min(1, "Seed Phrase is required"),
});

export type WithdrawAssetFormValues = z.infer<typeof WithdrawAssetFormSchema>;

export const emptyWithdrawAsset: WithdrawAssetFormValues = {
  address: "",
  amount: "",
  seedPhrase: "",
};
