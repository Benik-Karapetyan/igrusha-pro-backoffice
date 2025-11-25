import { z } from "zod";

export const TradingHistoryFiltersFormSchema = z.object({
  marketSymbolPairs: z.string().array(),
  createdAt: z.string().array(),
});

export type TradingHistoryFiltersFormValues = z.infer<typeof TradingHistoryFiltersFormSchema>;

export const emptyTradingHistoryFilters: TradingHistoryFiltersFormValues = {
  marketSymbolPairs: [],
  createdAt: [],
};
