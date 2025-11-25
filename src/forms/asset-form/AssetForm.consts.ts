import { z } from "zod";

export const AssetFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
  key: z.string(),
  networkId: z.number().positive(),
  coinId: z.number().positive(),
  type: z.number(),
  contractSupply: z.number().optional().or(z.literal("")),
  contractName: z.string().optional(),
  contractSymbol: z.string().optional(),
  contractAddress: z.string().optional(),
  contractDeployerAddress: z.string().optional(),
  contractAbi: z.string().optional(),
});

export type AssetFormValues = z.infer<typeof AssetFormSchema>;

export const emptyAsset: AssetFormValues = {
  name: "",
  key: "",
  networkId: 0,
  coinId: 0,
  type: 0,
  contractSupply: "",
  contractName: "",
  contractSymbol: "",
  contractAddress: "",
  contractDeployerAddress: "",
  contractAbi: "",
};

export const types = [
  { id: 0, name: "Crypto Coin" },
  { id: 1, name: "Crypto Token" },
  { id: 2, name: "Fiat" },
];
