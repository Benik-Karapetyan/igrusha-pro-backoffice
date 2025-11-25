import { z } from "zod";

export const BanCloseCustomerFormSchema = z.object({
  reason: z.number().positive("Reason is required"),
  jiraLink: z.string(),
  comment: z.string().min(1, "Comment is required"),
  confirmOrders: z.boolean().refine((val) => val === true, {
    message: "You must confirm that all orders are cancelled",
  }),
  confirmFunds: z.boolean().refine((val) => val === true, {
    message: "You must confirm that the customer has no funds in their account",
  }),
});

export type BanCloseCustomerFormValues = z.infer<typeof BanCloseCustomerFormSchema>;

export const emptyBanCloseCustomer: BanCloseCustomerFormValues = {
  reason: 0,
  jiraLink: "",
  comment: "",
  confirmOrders: false,
  confirmFunds: false,
};

export const closeReasons = [
  { name: "Customer Closure", id: 1 },
  { name: "Internal Decision", id: 2 },
];

export const banReasons = [
  { name: "Company Decision", id: 1 },
  { name: "Restricted Country", id: 2 },
  { name: "Under 18", id: 3 },
  { name: "Suspicious Activity", id: 4 },
  { name: "Fraud", id: 5 },
  { name: "Other", id: 6 },
];
