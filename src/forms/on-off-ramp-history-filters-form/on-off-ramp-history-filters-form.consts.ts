import { ENUM_ON_OFF_RAMP_GROUPED_STATUS, ENUM_ON_OFF_RAMP_TRANSACTION_TYPE } from "@types";
import { z } from "zod";

export const OnOffRampHistoryFiltersFormSchema = z.object({
  transactionType: z.number(),
  status: z.number(),
  currency: z.number(),
  paymentProviderId: z.number(),
  createdAt: z.string().array(),
});

export type OnOffRampHistoryFiltersFormValues = z.infer<typeof OnOffRampHistoryFiltersFormSchema>;

export const emptyOnOffRampHistoryFilters: OnOffRampHistoryFiltersFormValues = {
  transactionType: 0,
  status: 0,
  currency: 0,
  paymentProviderId: 0,
  createdAt: [],
};

export const onOffRampHistoryTransactionTypes = [
  { name: "On Ramp", id: ENUM_ON_OFF_RAMP_TRANSACTION_TYPE.OnRamp },
  { name: "Off Ramp", id: ENUM_ON_OFF_RAMP_TRANSACTION_TYPE.OffRamp },
  { name: "Refund", id: ENUM_ON_OFF_RAMP_TRANSACTION_TYPE.Refund },
];

export const onOffRampHistoryStatuses = [
  { name: "In Progress", id: ENUM_ON_OFF_RAMP_GROUPED_STATUS.InProgress },
  { name: "Pending", id: ENUM_ON_OFF_RAMP_GROUPED_STATUS.Pending },
  { name: "Completed", id: ENUM_ON_OFF_RAMP_GROUPED_STATUS.Completed },
  { name: "Rejected", id: ENUM_ON_OFF_RAMP_GROUPED_STATUS.Rejected },
];

export const onOffRampHistoryPaymentProviders = [{ name: "Alchemy Pay", id: 1 }];
