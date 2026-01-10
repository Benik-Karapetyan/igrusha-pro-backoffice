import { ENUM_ORDER_PAYMENT_METHOD, ENUM_ORDER_STATUS } from "@types";
import { z } from "zod";

export const OrderFormSchema = z.object({
  _id: z.string().optional(),
  paymentMethod: z.enum(["card", "cash"]),
  orderInstructions: z.string().max(1024, "Instructions must be less than 1024 characters"),
  shippingFee: z.number().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        image: z.string(),
        quantity: z.number().positive("Quantity must be greater than 0").or(z.string().min(1, "Quantity is required")),
        price: z.number().positive("Price must be greater than 0"),
        finalPrice: z.number().positive("Final Price must be greater than 0").or(z.literal("")),
        discount: z.number().or(z.literal("")),
      })
    )
    .min(1, "At least 1 product is required"),
  createdAt: z.string(),
});

export type OrderFormValues = z.infer<typeof OrderFormSchema>;

export const emptyOrder: OrderFormValues = {
  paymentMethod: "cash",
  orderInstructions: "",
  shippingFee: "",
  items: [],
  createdAt: "",
};

export const paymentMethods = [
  { name: "Card", id: ENUM_ORDER_PAYMENT_METHOD.Card },
  { name: "Cash", id: ENUM_ORDER_PAYMENT_METHOD.Cash },
];

export const orderStatuses = [
  { name: "On the way", id: ENUM_ORDER_STATUS.OnTheWay },
  { name: "Delivered", id: ENUM_ORDER_STATUS.Delivered },
  { name: "Cancelled", id: ENUM_ORDER_STATUS.Cancelled },
  { name: "Return Pending", id: ENUM_ORDER_STATUS.ReturnPending },
  { name: "Returned", id: ENUM_ORDER_STATUS.Returned },
];
