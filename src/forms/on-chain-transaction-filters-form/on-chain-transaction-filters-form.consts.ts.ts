import { ENUM_CUSTOMER_RISK_LEVEL, ENUM_ON_CHAIN_TRANSACTION_ACTION, ENUM_ON_CHAIN_TRANSACTION_STATUS } from "@types";
import { z } from "zod";

export const OnChainTransactionFiltersFormSchema = z.object({
  types: z.string().array(),
  network: z.string().array(),
  status: z.string().array(),
  assetSymbols: z.string().array(),
  riskLevel: z.string().array(),
  creationDate: z.string().array(),
});

export type OnChainTransactionFiltersFormValues = z.infer<typeof OnChainTransactionFiltersFormSchema>;

export const emptyOnChainTransactionFilters: OnChainTransactionFiltersFormValues = {
  types: [],
  network: [],
  status: [],
  assetSymbols: [],
  riskLevel: [],
  creationDate: [],
};

export const transactionTypes = [
  { name: "Deposit", id: ENUM_ON_CHAIN_TRANSACTION_ACTION.Deposit },
  { name: "Withdrawal", id: ENUM_ON_CHAIN_TRANSACTION_ACTION.Withdrawal },
];

export const onChainTransactionStatuses = [
  { name: "Completed", id: ENUM_ON_CHAIN_TRANSACTION_STATUS.Completed },
  { name: "Canceled", id: ENUM_ON_CHAIN_TRANSACTION_STATUS.Canceled },
  { name: "Pending", id: ENUM_ON_CHAIN_TRANSACTION_STATUS.Pending },
  { name: "In Progress", id: ENUM_ON_CHAIN_TRANSACTION_STATUS.InProgress },
];

export const riskLevels = [
  { name: "Low", id: ENUM_CUSTOMER_RISK_LEVEL.Low },
  { name: "Medium", id: ENUM_CUSTOMER_RISK_LEVEL.Medium },
  { name: "High", id: ENUM_CUSTOMER_RISK_LEVEL.High },
  { name: "Severe", id: ENUM_CUSTOMER_RISK_LEVEL.Severe },
];
