import { z } from "zod";

export const WithdrawNodeFormSchema = z.object({
  id: z.number(),
  address: z.string().min(1, "Address is required"),
  amount: z.number().positive("Min value must be greater than 0").or(z.string().min(1, "Amount is required")),
});

export type WithdrawNodeFormValues = z.infer<typeof WithdrawNodeFormSchema>;

export const emptyWithdrawNode: WithdrawNodeFormValues = {
  id: 0,
  address: "",
  amount: "",
};
