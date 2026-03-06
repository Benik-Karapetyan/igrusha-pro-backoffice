import { z } from "zod";

const ProductIdSchema = z.object({
  _id: z.string().min(1, "Product ID is required"),
});

export const EntryFormSchema = z.object({
  _id: z.string().optional(),
  productId: ProductIdSchema.optional(),
  quantity: z.number().positive("Quantity must be greater than 0").or(z.string().min(1, "Quantity is required")),
  createdAt: z.string(),
});

export type EntryFormValues = z.infer<typeof EntryFormSchema>;

export const emptyEntry: EntryFormValues = {
  quantity: "",
  createdAt: "",
};
