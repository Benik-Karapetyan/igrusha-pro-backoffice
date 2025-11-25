import { z } from "zod";

export const NodeFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string(),
  rpc: z.string(),
  username: z.string(),
  password: z.string(),
  withdrawAddress: z.string(),
  stack: z.string(),
  keypass: z.string(),
  keystore: z.string(),
  chain: z.string(),
  scannerId: z.number(),
  networkId: z.number(),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export type NodeFormValues = z.infer<typeof NodeFormSchema>;

export const emptyNode: NodeFormValues = {
  name: "",
  rpc: "",
  username: "",
  password: "",
  withdrawAddress: "",
  stack: "",
  keypass: "",
  keystore: "",
  chain: "",
  scannerId: 0,
  networkId: 0,
  status: 1,
};
