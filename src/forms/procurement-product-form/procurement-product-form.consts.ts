import { z } from "zod";

export const ProcurementProductFormSchema = z.object({
  _id: z.string().optional(),
  image: z.string().min(1, "Image is required"),
  url: z.string().min(1, "URL is required"),
  price: z.number().positive("Min value must be greater than 0").or(z.string().min(1, "Price is required")),
  cartonQuantity: z.number().positive("Carton quantity must be greater than 0").or(z.literal("")),
  cartonWeight: z.number().positive("Carton weight must be greater than 0").or(z.literal("")),
  cartonSize: z
    .object({
      length: z.number().positive("Length must be greater than 0").or(z.literal("")).optional(),
      width: z.number().positive("Width must be greater than 0").or(z.literal("")).optional(),
      height: z.number().positive("Height must be greater than 0").or(z.literal("")).optional(),
    })
    .optional(),
  quantity: z.number().positive("Quantity must be greater than 0").or(z.literal("")),
  deliveryInsideCost: z.number().positive("Delivery inside cost must be greater than 0").or(z.literal("")),
  deliveryInsideDuration: z.string().optional(),
  paymentFee: z.number().positive("Payment fee must be greater than 0").or(z.literal("")),
  brand: z.string().optional(),
  seller: z.string().optional(),
  isOrdered: z.boolean().optional(),
});

export type ProcurementProductFormValues = z.infer<typeof ProcurementProductFormSchema>;

export const emptyProcurementProduct: ProcurementProductFormValues = {
  image: "",
  url: "",
  price: "",
  cartonQuantity: "",
  cartonWeight: "",
  cartonSize: {
    length: "",
    width: "",
    height: "",
  },
  quantity: "",
  deliveryInsideCost: "",
  deliveryInsideDuration: "",
  paymentFee: "",
  brand: "",
  seller: "",
};
