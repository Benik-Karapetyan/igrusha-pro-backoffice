import { ENUM_PRODUCT_GENDER } from "@types";
import { z } from "zod";

export const ProductFormSchema = z.object({
  _id: z.string().optional(),
  gallery: z.array(z.string()).min(1, "At least 1 image is required"),
  urlName: z.string().min(1, "URL name is required"),
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
  cost: z.number().positive("Min value must be greater than 0").or(z.string().min(1, "Cost is required")),
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
    .or(z.string().min(1, "Number in stock is required")),
  gender: z.enum(["unisex", "boy", "girl"]),
  ageRange: z.object({
    from: z
      .number()
      .positive("Min age must be greater than 0")
      .or(z.string().min(1, "Min age is required"))
      .or(z.literal(0)),
    to: z.number().positive("Max age must be greater than 0").or(z.literal("")).optional(),
  }),
  size: z
    .object({
      length: z.number().positive("Length must be greater than 0").or(z.string().min(1, "Length is required")),
      width: z.number().positive("Width must be greater than 0").or(z.string().min(1, "Width is required")),
      height: z.number().positive("Height must be greater than 0").or(z.string().min(1, "Height is required")),
    })
    .optional(),
  boxSize: z
    .object({
      length: z.number().positive("Length must be greater than 0").or(z.literal("")).optional(),
      width: z.number().positive("Width must be greater than 0").or(z.literal("")).optional(),
      height: z.number().positive("Height must be greater than 0").or(z.literal("")).optional(),
    })
    .optional(),
  brand: z.string().optional(),
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
  urlName: "",
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
  cost: "",
  price: "",
  discount: "",
  numberInStock: "",
  sectionName: "",
  gender: "unisex",
  ageRange: {
    from: "",
    to: "",
  },
  size: {
    length: "",
    width: "",
    height: "",
  },
  boxSize: {
    length: "",
    width: "",
    height: "",
  },
  rating: 0,
  reviewCount: 0,
  relatedProducts: [],
};

export const genderOptions = [
  { name: "Unisex", id: ENUM_PRODUCT_GENDER.Unisex },
  { name: "Boy", id: ENUM_PRODUCT_GENDER.Boy },
  { name: "Girl", id: ENUM_PRODUCT_GENDER.Girl },
];
