import { z } from "zod";

export const LevelFeeFormSchema = z.object({
  id: z.number().optional(),
  regionId: z.literal(250),
  tradingProductType: z.literal(1),
  levelId: z.number().positive("Level is required"),
  tradeVolumeIn30Days: z
    .number()
    .positive("Min value must be greater than 0")
    .or(z.string().min(1, "30-day trading volume is required")),
  makerFee: z
    .number()
    .positive("Min value must be greater than or equal to 0")
    .max(5, "Max value is 5")
    .or(z.literal(0))
    .or(z.string().min(1, "Maker fee is required")),
  takerFee: z
    .number()
    .positive("Min value must be greater than or equal to 0")
    .max(5, "Max value is 5")
    .or(z.literal(0))
    .or(z.string().min(1, "Taker fee is required")),
});

export type LevelFeeFormValues = z.infer<typeof LevelFeeFormSchema>;

export const emptyLevelFee: LevelFeeFormValues = {
  regionId: 250,
  tradingProductType: 1,
  levelId: 0,
  tradeVolumeIn30Days: "",
  makerFee: "",
  takerFee: "",
};
