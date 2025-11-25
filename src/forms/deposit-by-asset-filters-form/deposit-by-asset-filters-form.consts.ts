import { z } from "zod";

export const DepositByAssetFiltersFormSchema = z.object({
  assetIds: z.string().array(),
  depositDate: z.string().array(),
});

export type DepositByAssetFiltersFormValues = z.infer<typeof DepositByAssetFiltersFormSchema>;

export const emptyDepositByAssetFilters: DepositByAssetFiltersFormValues = {
  assetIds: [],
  depositDate: [],
};
