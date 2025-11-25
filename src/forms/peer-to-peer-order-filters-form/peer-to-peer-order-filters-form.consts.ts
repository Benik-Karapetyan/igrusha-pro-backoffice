import { z } from "zod";

export const PeerToPeerOrderFiltersFormSchema = z.object({
  date: z.string().array(),
  offerStatus: z.string().array(),
  type: z.string(),
  fiat: z.string().array(),
  crypto: z.string().array(),
  paymentMethod: z.string().array(),
});

export type PeerToPeerOrderFiltersFormValues = z.infer<typeof PeerToPeerOrderFiltersFormSchema>;

export const emptyPeerToPeerOrderFilters: PeerToPeerOrderFiltersFormValues = {
  date: [],
  offerStatus: [],
  type: "",
  fiat: [],
  crypto: [],
  paymentMethod: [],
};

export const peerToPeerOrderStatuses = [
  { name: "Active", id: "active" },
  { name: "Inactive", id: "inactive" },
  { name: "Filled", id: "filled" },
  { name: "Deleted", id: "deleted" },
];

export const peerToPeerOrderTypes = [
  { name: "Buy", id: "buy" },
  { name: "Sell", id: "sell" },
];

export const peerToPeerOrderFiats = [
  { name: "USD", id: "USD" },
  { name: "EUR", id: "EUR" },
  { name: "RUB", id: "RUB" },
  { name: "AMD", id: "AMD" },
  { name: "GBP", id: "GBP" },
];

export const peerToPeerOrderCryptos = [
  { name: "BTCP", id: "BTCP" },
  { name: "CHAIN", id: "CHAIN" },
  { name: "CNY", id: "CNY" },
  { name: "BTCH", id: "BTCH" },
  { name: "COQUI", id: "COQUI" },
  { name: "CVC", id: "CVC" },
];

export const peerToPeerOrderPaymentMethods = [
  { name: "Revolut", id: "Revolut" },
  { name: "Ameriabank", id: "Ameriabank" },
  { name: "IDram", id: "IDram" },
  { name: "Paypal", id: "Paypal" },
  { name: "Paysera", id: "Paysera" },
];
