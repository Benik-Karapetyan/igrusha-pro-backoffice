import { z } from "zod";

export const SuspendCustomerFormSchema = z.object({
  reason: z.number().positive("Reason is required"),
  jiraLink: z.string(),
  comment: z.string().min(1, "Comment is required"),
  restrictedActions: z.number().array(),
});

export type SuspendCustomerFormValues = z.infer<typeof SuspendCustomerFormSchema>;

export const emptySuspendCustomer: SuspendCustomerFormValues = {
  reason: 0,
  jiraLink: "",
  comment: "",
  restrictedActions: [],
};

export const suspendActions = [
  { name: "Login", id: 1 },
  { name: "Deposit", id: 2 },
  { name: "Withdrawal", id: 4 },
  { name: "Internal Transfer", id: 8 },
  { name: "Trading", id: 16 },
  { name: "P2P Trading", id: 32 },
  { name: "P2P Offer Creation", id: 64 },
];

export const suspendReasons = [
  { name: "Company Decision", id: 1 },
  { name: "Restricted Country", id: 2 },
  { name: "Under 18", id: 3 },
  { name: "Suspicious Activity", id: 4 },
  { name: "Fraud", id: 5 },
  { name: "Other", id: 6 },
];
