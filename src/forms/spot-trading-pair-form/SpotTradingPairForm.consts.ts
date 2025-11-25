import { z } from "zod";

export const SpotTradingPairFormSchema = z.object({
  id: z.number().positive().optional(),
  firstCoinId: z.number(),
  secondCoinId: z.number(),
  baseMinAmount: z
    .number()
    .positive("Min value must be greater than 0")
    .or(z.string().min(1, "Base Min Order Amount is required")),
  baseMaxAmount: z
    .number()
    .positive("Min value must be greater than 0")
    .or(z.string().min(1, "Base Max Order Amount is required")),
  quoteMinAmount: z
    .number()
    .positive("Min value must be greater than 0")
    .or(z.string().min(1, "Quote Min Order Amount is required")),
  quoteMaxAmount: z
    .number()
    .positive("Min value must be greater than 0")
    .or(z.string().min(1, "Quote Max Order Amount is required")),
  priceIncrement: z
    .number()
    .positive("Min value must be greater than 0")
    .or(z.string().min(1, "Min Price Increment is required")),
  baseAmountIncrement: z
    .number()
    .positive("Min value must be greater than 0")
    .or(z.string().min(1, "Base Amount Increment is required")),
  baseAmountPrecision: z.number().or(z.string().min(1, "Base Amount Precision is required")),
  pricePrecision: z.number().or(z.string().min(1, "Price Precision is required")),
  categoriesId: z.number().array(),
});

export type SpotTradingPairFormValues = z.infer<typeof SpotTradingPairFormSchema>;

export const emptySpotTradingPair: SpotTradingPairFormValues = {
  firstCoinId: 0,
  secondCoinId: 0,
  baseMinAmount: "",
  baseMaxAmount: "",
  quoteMinAmount: "",
  quoteMaxAmount: "",
  priceIncrement: "",
  baseAmountIncrement: "",
  baseAmountPrecision: "",
  pricePrecision: "",
  categoriesId: [],
};
