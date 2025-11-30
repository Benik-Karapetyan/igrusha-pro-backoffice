import { z } from "zod";

export const ProductFormSchema = z.object({
  _id: z.string().optional(),
  gallery: z.array(z.string()).min(1, "At least 1 image is required"),
  name: z.object({
    am: z.string().min(1, "Name is required"),
    ru: z.string().min(1, "Name is required"),
    en: z.string().min(1, "Name is required"),
  }),
  description: z.object({
    am: z.string().min(1, "Description is required"),
    ru: z.string().min(1, "Description is required"),
    en: z.string().min(1, "Description is required"),
  }),
  price: z.number().positive("Min value must be greater than 0").or(z.string().min(1, "Price is required")),
  discount: z
    .number()
    .positive("Discount must be greater than 0")
    .max(99, "Discount must be less than 100")
    .or(z.literal(0))
    .or(z.literal("")),
  numberInStock: z
    .number()
    .positive("Number in stock must be greater than or equal to 0")
    .or(z.literal(0))
    .or(z.literal("")),
  rating: z
    .number()
    .positive("Rating must be greater than 0")
    .max(5, "Rating must be less than or equal to 5")
    .or(z.literal(0)),
  reviewCount: z.number().positive("Review count must be greater than 0").or(z.literal(0)),
  isPublished: z.boolean().optional(),
  isVariantOf: z.string().optional(),
  sectionName: z.string().min(1, "Section name is required"),
  relatedProducts: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

export const emptyProduct: ProductFormValues = {
  gallery: [],
  name: {
    am: "",
    ru: "",
    en: "",
  },
  description: {
    am: "",
    ru: "",
    en: "",
  },
  price: "",
  discount: "",
  numberInStock: "",
  rating: 0,
  reviewCount: 0,
  sectionName: "",
  relatedProducts: [],
};
