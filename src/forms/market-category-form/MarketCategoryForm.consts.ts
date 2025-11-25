import { z } from "zod";

export const MarketCategoryFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
});

export type MarketCategoryFormValues = z.infer<typeof MarketCategoryFormSchema>;

export const emptyMarketCategory: MarketCategoryFormValues = {
  name: "",
};
