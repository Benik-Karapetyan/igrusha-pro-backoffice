import { z } from "zod";

export const WithdrawVaultFormSchema = z.object({
  address: z.string().min(1, "Address is required"),
  amount: z.number().positive("Min value must be greater than 0").or(z.string().min(1, "Amount is required")),
  seedPhrase: z.string().min(1, "Seed Phrase is required"),
  assetId: z.number(),
});

export type WithdrawVaultFormValues = z.infer<typeof WithdrawVaultFormSchema>;

export const emptyWithdrawVault: WithdrawVaultFormValues = {
  address: "",
  amount: "",
  seedPhrase: "",
  assetId: 0,
};
