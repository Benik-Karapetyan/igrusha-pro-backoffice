import { HeaderItem } from "@ui-kit";
import { formatAmount } from "@utils";

export const useOnChainTransactionLogHistoryHeaders = () => {
  const headers: HeaderItem[] = [
    { text: "type", value: "type" },
    { text: "description", value: "description" },
    { text: "amount", value: (item) => (typeof item.amount === "string" ? formatAmount(+item.amount) : "") },
  ];

  return {
    headers,
  };
};
