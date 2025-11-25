import { z } from "zod";

export const CustomFeeFormSchema = z.object({
  id: z.number().optional(),
  locationId: z.literal(250),
  tradingProductType: z.literal(1),
  levelId: z.number().positive("Level is required"),
  makerFee: z
    .number()
    .positive("Min value must be greater than or equal to 0")
    .or(z.literal(0))
    .or(z.string().min(1, "Maker fee is required")),
  takerFee: z
    .number()
    .positive("Min value must be greater than or equal to 0")
    .or(z.literal(0))
    .or(z.string().min(1, "Taker fee is required")),
});

export type CustomFeeFormValues = z.infer<typeof CustomFeeFormSchema>;

export const emptyCustomFee: CustomFeeFormValues = {
  locationId: 250,
  tradingProductType: 1,
  levelId: 0,
  makerFee: "",
  takerFee: "",
};
