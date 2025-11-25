import { z } from "zod";

const TotalBalanceSchema = z.object({
  base: z.object({
    currency: z.string(),
    amount: z.number(),
  }),
  quote: z.object({
    currency: z.string(),
    amount: z.number(),
  }),
});

const AssetTransferAssetSchema = z.object({
  name: z.string(),
  symbol: z.string(),
});

const AccountSchema = z.object({
  type: z.string().min(1, "Type is required"),
  allocation: z.literal("Available"),
});

export const AssetTransferFormSchema = z.object({
  id: z.string().optional(),
  totalBalance: TotalBalanceSchema,
  initiator: z.string(),
  asset: AssetTransferAssetSchema,
  from: AccountSchema,
  to: AccountSchema,
  amount: z.number().positive("Min value must be greater than 0").or(z.string().min(1, "Amount is required")),
});

export type AssetTransferFormValues = z.infer<typeof AssetTransferFormSchema>;

export const emptyAssetTransfer: AssetTransferFormValues = {
  totalBalance: {
    base: {
      currency: "",
      amount: 0,
    },
    quote: {
      currency: "",
      amount: 0,
    },
  },
  initiator: "",
  asset: {
    name: "",
    symbol: "",
  },
  from: {
    type: "",
    allocation: "Available",
  },
  to: {
    type: "",
    allocation: "Available",
  },
  amount: "",
};
