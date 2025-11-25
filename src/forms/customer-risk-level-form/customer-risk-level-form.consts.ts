import { z } from "zod";

export const CustomerRiskLevelFormSchema = z.object({
  level: z.number(),
  note: z.string(),
});

export type CustomerRiskLevelFormValues = z.infer<typeof CustomerRiskLevelFormSchema>;

export const emptyCustomerRiskLevel: CustomerRiskLevelFormValues = {
  level: 0,
  note: "",
};

export const customerRiskLevels = [
  { name: "Low", id: 1 },
  { name: "Medium", id: 2 },
  { name: "High", id: 3 },
  { name: "Severe", id: 4 },
];
