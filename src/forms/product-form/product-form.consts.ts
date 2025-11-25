import { z } from "zod";

export const ProductFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  key: z.string(),
  locationIds: z.number().array(),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

export const emptyProduct: ProductFormValues = {
  name: "",
  description: "",
  key: "",
  locationIds: [],
  status: 1,
};
