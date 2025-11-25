import { z } from "zod";

export const CoinFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
  symbol: z.string(),
  derivePath: z.string(),
  nodeId: z.number(),
});

export type CoinFormValues = z.infer<typeof CoinFormSchema>;

export const emptyCoin: CoinFormValues = {
  name: "",
  symbol: "",
  derivePath: "",
  nodeId: 0,
};
