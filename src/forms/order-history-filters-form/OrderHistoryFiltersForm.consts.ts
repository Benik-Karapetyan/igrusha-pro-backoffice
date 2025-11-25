import { ENUM_ORDER_HISTORY_STATUS } from "@types";
import { z } from "zod";

export const OrderHistoryFiltersFormSchema = z.object({
  status: z.string(),
  types: z.string().array(),
  marketSymbolPairs: z.string().array(),
  sides: z.string().array(),
  createdAt: z.string().array(),
});

export type OrderHistoryFiltersFormValues = z.infer<typeof OrderHistoryFiltersFormSchema>;

export const emptyOrderHistoryFilters: OrderHistoryFiltersFormValues = {
  status: "",
  types: [],
  marketSymbolPairs: [],
  sides: [],
  createdAt: [],
};

export const orderHistoryStatuses = [
  { name: "New", id: ENUM_ORDER_HISTORY_STATUS.New },
  { name: "Partially Filled", id: ENUM_ORDER_HISTORY_STATUS.PartiallyFilled },
  { name: "Filled", id: ENUM_ORDER_HISTORY_STATUS.Filled },
  { name: "Canceled", id: ENUM_ORDER_HISTORY_STATUS.Canceled },
];

export const orderHistoryTypes = [
  { name: "Market", id: "Market" },
  { name: "Limit", id: "Limit" },
];

export const orderHistorySides = [
  { name: "Buy", id: "Buy" },
  { name: "Sell", id: "Sell" },
];
