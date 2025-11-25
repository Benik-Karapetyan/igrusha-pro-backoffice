import { z } from "zod";

const LevelSchema = z.object({
  id: z.number().optional(),
  minReferrals: z
    .number()
    .positive("Min value must be greater than or equal to 0")
    .or(z.literal(0))
    .or(z.string().min(1, "Min number of referred is required")),
  maxCommissionPercent: z
    .number()
    .positive("Min value must be greater than 0")
    .or(z.string().min(1, "Referral reward is required")),
});

export const LevelingSystemFormSchema = z.object({
  id: z.string().optional(),
  levels: LevelSchema.array(),
});

export type LevelingSystemFormValues = z.infer<typeof LevelingSystemFormSchema>;
export type LevelSchemaValues = z.infer<typeof LevelSchema>;

export const emptyLevelItem: LevelSchemaValues = {
  minReferrals: "",
  maxCommissionPercent: "",
};

export const emptyLevelingSystem: LevelingSystemFormValues = {
  levels: [emptyLevelItem],
};
