import { z } from "zod";

export const TradingFeeFormSchema = z.object({
  id: z.number().positive().optional(),
  regionId: z.number(),
  levelId: z.number(),
  makerFee: z
    .number()
    .positive("Min value must be greater than 0")
    .max(1, "Max value is 1")
    .or(z.string().min(1, "Maker Fee is required")),
  takerFee: z
    .number()
    .positive("Min value must be greater than 0")
    .max(1, "Max value is 1")
    .or(z.string().min(1, "Taker Fee is required")),
  tradeVolumeIn30Days: z
    .number()
    .min(0, "Value must be greater than or equal to 0")
    .or(z.string().min(1, "Trade Volume is required")),
  key: z.string(),
  isDefault: z.union([z.literal(0), z.literal(1)]),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

export type TradingFeeFormValues = z.infer<typeof TradingFeeFormSchema>;

export const emptyTradingFee: TradingFeeFormValues = {
  regionId: 0,
  levelId: 0,
  makerFee: "",
  takerFee: "",
  tradeVolumeIn30Days: "",
  key: "",
  isDefault: 0,
};
