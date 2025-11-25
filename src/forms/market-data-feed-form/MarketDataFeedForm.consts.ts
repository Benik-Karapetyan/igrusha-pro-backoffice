import { z } from "zod";

export const MarketDataFeedFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
  key: z.string(),
  url: z.string(),
});

export type MarketDataFeedFormValues = z.infer<typeof MarketDataFeedFormSchema>;

export const emptyMarketDataFeed: MarketDataFeedFormValues = {
  name: "",
  key: "",
  url: "",
};
