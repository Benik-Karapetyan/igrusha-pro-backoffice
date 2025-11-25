import { z } from "zod";

export const WithdrawalDepositSettingFormSchema = z
  .object({
    id: z.number().positive().optional(),
    coinId: z.number(),
    networkId: z.number(),
    minDeposit: z.number().or(z.literal("")),
    minWithdrawal: z
      .number()
      .positive("Min value must be greater than 0")
      .or(z.string().min(1, "Min Withdrawal is required")),
    maxWithdrawal: z
      .number()
      .positive("Min value must be greater than 0")
      .or(z.string().min(1, "Max Withdrawal is required")),
    withdrawalFee: z
      .number()
      .positive("Min value must be greater than 0")
      .or(z.string().min(1, "Withdrawal Fee is required")),
    depositFee: z
      .number()
      .positive("Min value must be greater than or equal to 0")
      .or(z.literal(0))
      .or(z.string().min(1, "Deposit Fee is required")),
  })
  .refine((data) => data.minWithdrawal <= data.maxWithdrawal, {
    message: "Min Withdrawal cannot be greater than Max Withdrawal",
    path: ["minWithdrawal"],
  });

export type WithdrawalDepositSettingFormValues = z.infer<typeof WithdrawalDepositSettingFormSchema>;

export const emptyWithdrawalDepositSetting: WithdrawalDepositSettingFormValues = {
  coinId: 0,
  networkId: 0,
  minDeposit: "",
  minWithdrawal: "",
  maxWithdrawal: "",
  withdrawalFee: "",
  depositFee: "",
};
