import { z } from "zod";

export const WithdrawalByAssetFiltersFormSchema = z.object({
  assetIds: z.string().array(),
  withdrawalDate: z.string().array(),
});

export type WithdrawalByAssetFiltersFormValues = z.infer<typeof WithdrawalByAssetFiltersFormSchema>;

export const emptyWithdrawalByAssetFilters: WithdrawalByAssetFiltersFormValues = {
  assetIds: [],
  withdrawalDate: [],
};
