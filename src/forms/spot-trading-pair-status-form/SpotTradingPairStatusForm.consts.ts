import { z } from "zod";

const TradingModeSchema = z.union([z.literal("PostOnly"), z.literal("LimitOnly"), z.literal("FullTrading")]);
const SpotTradingPairStatusSchema = z
  .union([
    z.literal("Deleted"),
    z.literal("Blocked"),
    z.literal("Inactive"),
    z.literal("Preactive"),
    z.literal("Active"),
  ])
  .optional();

export const SpotTradingPairStatusFormSchema = z.object({
  id: z.number(),
  tradingMode: TradingModeSchema.or(z.string().min(1, "Trading Mode is required")),
  durationInMinutes: z
    .number()
    .positive("Value must be greater than 0")
    .or(z.string().min(1, "Duration in minutes is required"))
    .optional(),
  status: SpotTradingPairStatusSchema,
  enableMatching: z.boolean(),
});

export type SpotTradingPairStatusFormValues = z.infer<typeof SpotTradingPairStatusFormSchema>;
export type TradingModeValues = z.infer<typeof TradingModeSchema>;
export type SpotTradingPairStatusValues = z.infer<typeof SpotTradingPairStatusSchema>;

export const emptySpotTradingPairStatus: SpotTradingPairStatusFormValues = {
  id: 0,
  tradingMode: "",
  durationInMinutes: "",
  status: "Inactive",
  enableMatching: false,
};

export const tradingModesPreActive = [
  { name: "Post Only", id: "PostOnly" },
  { name: "Limit Only", id: "LimitOnly" },
];

export const tradingModesActive = [
  { name: "Post Only", id: "PostOnly" },
  { name: "Limit Only", id: "LimitOnly" },
  { name: "Full Trading", id: "FullTrading" },
];
