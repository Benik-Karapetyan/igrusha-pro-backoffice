import { z } from "zod";

const TradingContestRewardSchema = z.object({
  placeNumber: z.number().or(z.literal("")),
  maxRank: z.number().positive().or(z.string().min(1, "Max Rank is required")),
  rewardPart: z.number().positive().or(z.string().min(1, "Amount is required")),
});

export const TradingContestFormSchema = z.object({
  id: z.number().positive().optional(),
  imageTag: z.string().min(1, "Image is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  duration: z.string().array().min(2, "Duration is required"),
  markets: z.string().array().min(1, "At least one Trading Pair is required"),
  prizeSymbol: z.string().min(1, "Reward currency is required"),
  rewards: z.array(TradingContestRewardSchema),
});

type TradingContestRewardValues = z.infer<typeof TradingContestRewardSchema>;
export type TradingContestFormValues = z.infer<typeof TradingContestFormSchema>;

export const emptyTradingContestReward: TradingContestRewardValues = {
  placeNumber: "",
  maxRank: "",
  rewardPart: "",
};

export const emptyTradingContest: TradingContestFormValues = {
  imageTag: "",
  name: "",
  description: "",
  duration: [],
  markets: [],
  prizeSymbol: "",
  rewards: [emptyTradingContestReward],
};
