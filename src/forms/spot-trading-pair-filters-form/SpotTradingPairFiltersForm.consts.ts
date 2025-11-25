import { z } from "zod";

const SpotTradingPairStatusSchema = z.union([z.literal(""), z.literal(1), z.literal(2), z.literal(3)]);

export const SpotTradingPairFiltersFormSchema = z.object({
  baseAsset: z.number().positive().or(z.literal("")),
  quoteAsset: z.number().positive().or(z.literal("")),
  status: SpotTradingPairStatusSchema,
  categories: z.string().array(),
  createdAt: z.string().array(),
  updatedAt: z.string().array(),
});

export type SpotTradingPairFiltersFormValues = z.infer<typeof SpotTradingPairFiltersFormSchema>;
export type SpotTradingPairFilterStatusValues = z.infer<typeof SpotTradingPairStatusSchema>;

export const emptySpotTradingPairFilters: SpotTradingPairFiltersFormValues = {
  baseAsset: "",
  quoteAsset: "",
  status: "",
  categories: [],
  createdAt: [],
  updatedAt: [],
};

export const spotTradingPairStatuses = [
  { name: "Active", id: 1 },
  { name: "Inactive", id: 2 },
  { name: "Deleted", id: 3 },
  { name: "Pre Active", id: 4 },
  { name: "Blocked", id: 5 },
];

export const spotTradingPairFiltersValueMapper = {
  baseAsset: 1,
  quoteAsset: 2,
  status: 3,
  categories: 4,
};
