import { z } from "zod";

export const NetworkFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
  key: z.string(),
});

export type NetworkFormValues = z.infer<typeof NetworkFormSchema>;

export const emptyNetwork: NetworkFormValues = {
  name: "",
  key: "",
};
