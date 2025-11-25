import { z } from "zod";

const VaultAssetSchema = z.object({
  assetId: z.number(),
  nodeIds: z.number().array(),
});

export const VaultFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
  key: z.string(),
  type: z.number(),
  vaultAssets: VaultAssetSchema.array(),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export type VaultFormValues = z.infer<typeof VaultFormSchema>;

export const emptyVaultAsset = {
  assetId: 0,
  nodeIds: [],
};

export const emptyVault: VaultFormValues = {
  name: "",
  key: "",
  type: 0,
  vaultAssets: [emptyVaultAsset],
  status: 1,
};

export const vaultTypes = [
  { id: 0, name: "Not any" },
  { id: 1, name: "Chainstack" },
];
