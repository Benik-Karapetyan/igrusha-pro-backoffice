import { z } from "zod";

export const AlertCenterOnChainTransactionFiltersFormSchema = z.object({
  type: z.string(),
  riskLevel: z.string(),
  status: z.string(),
  transactionDate: z.string().array(),
});

export type AlertCenterOnChainTransactionFiltersFormValues = z.infer<
  typeof AlertCenterOnChainTransactionFiltersFormSchema
>;

export const alertCenterOnChainTransactionTypes = [
  { name: "Deposit", id: "Deposit" },
  { name: "Withdrawal", id: "Withdrawal" },
];

export const alertCenterOnChainRiskLevels = [
  { name: "Low", id: "Low" },
  { name: "Medium", id: "Medium" },
  { name: "High", id: "High" },
];

export const alertCenterOnChainDecisionStatuses = [
  { name: "Pending", id: "Pending" },
  { name: "Completed", id: "Completed" },
  { name: "Rejected", id: "Rejected" },
];

export const emptyAlertCenterOnChainTransactionFilters: AlertCenterOnChainTransactionFiltersFormValues = {
  type: "",
  riskLevel: "",
  status: "",
  transactionDate: [],
};
