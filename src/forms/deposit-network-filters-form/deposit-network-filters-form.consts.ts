import { z } from "zod";

export const DepositNetworkFiltersFormSchema = z.object({
  assetIds: z.string().array(),
  networks: z.string().array(),
});

export type DepositNetworkFiltersFormValues = z.infer<typeof DepositNetworkFiltersFormSchema>;

export const emptyDepositNetworkFilters: DepositNetworkFiltersFormValues = {
  assetIds: [],
  networks: [],
};
