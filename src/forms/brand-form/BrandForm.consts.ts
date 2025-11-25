import { z } from "zod";

export const BrandFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
});

export type BrandFormValues = z.infer<typeof BrandFormSchema>;

export const emptyBrand: BrandFormValues = {
  name: "",
};
