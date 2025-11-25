import { z } from "zod";

export const WithdrawalNetworkFiltersFormSchema = z.object({
  assetIds: z.string().array(),
  networks: z.string().array(),
});

export type WithdrawalNetworkFiltersFormValues = z.infer<typeof WithdrawalNetworkFiltersFormSchema>;

export const emptyWithdrawalNetworkFilters: WithdrawalNetworkFiltersFormValues = {
  assetIds: [],
  networks: [],
};
