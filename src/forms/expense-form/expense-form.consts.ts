import { ENUM_EXPENSE_TYPE } from "@types";
import { z } from "zod";

export const ExpenseFormSchema = z.object({
  _id: z.string().optional(),
  type: z.enum(["products", "logistics", "tax", "advertisement", "salary", "utilities"]),
  description: z.string().min(1, "Description is required").max(1024, "Description must be less than 1024 characters"),
  amount: z.number().positive("Amount must be greater than 0").or(z.string().min(1, "Amount is required")),
  createdAt: z.string(),
});

export type ExpenseFormValues = z.infer<typeof ExpenseFormSchema>;

export const emptyExpense: ExpenseFormValues = {
  type: "products",
  description: "",
  amount: "",
  createdAt: "",
};

export const expenseTypes = [
  { name: "Products", id: ENUM_EXPENSE_TYPE.Products },
  { name: "Logistics", id: ENUM_EXPENSE_TYPE.Logistics },
  { name: "Tax", id: ENUM_EXPENSE_TYPE.Tax },
  { name: "Advertisement", id: ENUM_EXPENSE_TYPE.Advertisement },
  { name: "Salary", id: ENUM_EXPENSE_TYPE.Salary },
  { name: "Utilities", id: ENUM_EXPENSE_TYPE.Utilities },
];
