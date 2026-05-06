import { z } from "zod";

export const UtilizedProductFormSchema = z.object({
  _id: z.string().optional(),
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().positive("Quantity must be greater than 0").or(z.string().min(1, "Quantity is required")),
  note: z.string().min(1, "Description is required").max(1024, "Description must be less than 1024 characters"),
  createdAt: z.string(),
});

export type UtilizedProductFormValues = z.infer<typeof UtilizedProductFormSchema>;

export const emptyUtilizedProduct: UtilizedProductFormValues = {
  productId: "",
  quantity: "",
  note: "",
  createdAt: "",
};
