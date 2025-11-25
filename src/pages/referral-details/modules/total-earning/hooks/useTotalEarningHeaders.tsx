import { HeaderItem, TableItem } from "@ui-kit";
import { convertScientificToDecimal } from "@utils";

export const useTotalEarningHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "assets",
      value: (item: TableItem) =>
        typeof item.coinSymbol === "string" && (
          <img src={`/icons/currencies/${item.coinSymbol.toUpperCase()}.svg`} alt="" className="h-6 w-6" />
        ),
    },
    {
      text: "paid rewards",
      value: (item: TableItem) => {
        return typeof item?.amount === "number" && `${item?.amount} ${item?.coinSymbol}`;
      },
    },
    {
      text: "pending rewards",
      value: (item: TableItem) => {
        return (
          typeof item?.threshold === "number" && `${convertScientificToDecimal(item?.threshold)} ${item?.coinSymbol}`
        );
      },
    },
  ];

  return {
    headers,
  };
};
