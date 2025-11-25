import { PaymentHistoryMethodCell, PaymentHistoryStatusCell, TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { HeaderItem, Icon } from "@ui-kit";

export const usePaymentHistoryHeaders = () => {
  const headers: HeaderItem[] = [
    { text: "Order ID", value: "id", width: 73 },
    { text: "Provider Name", value: "paymentProviderName", width: 111 },
    { text: "Provider Order ID", value: "providerOrderId" },
    { text: "Customer ID", value: "paymentProviderId", width: 120 },
    {
      text: "Status",
      value: (item) =>
        typeof item.status === "number" ? (
          <PaymentHistoryStatusCell status={item.status} />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "Order Type",
      value: (item) =>
        typeof item.orderType === "number" ? (
          <PaymentHistoryMethodCell status={item.orderType} />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 90,
    },
    { text: "Method", value: "Name" },
    { text: "Fiat Currency", value: "fiatCurrency" },
    { text: "Fiat Amount", value: "amount" },
    {
      text: "Crypto Currency",
      value: (item) => (
        <div className="flex items-center gap-2">
          {typeof item.currency === "string" ? (
            <>
              <img src={`/icons/currencies/${item.currency.toUpperCase()}.svg`} alt="" className="h-6 w-6" />

              {item.currency}
            </>
          ) : (
            <Icon name={mdiMinus} dense />
          )}
        </div>
      ),
      width: 95,
    },
    { text: "Network", value: "network" },
    { text: "Crypto Amount", value: "cryptoAmount" },
    { text: "Crypto Price", value: "cryptoPrice" },
    { text: "Fiat Fee", value: "commissionFee" },
    {
      text: "Pay Time",
      value: (item) =>
        typeof item?.payTime === "string" ? <TableDateCell date={item.payTime} /> : <Icon name={mdiMinus} dense />,
    },
    { text: "Tx Hash", value: "cryptoHash" },
  ];

  return {
    headers,
  };
};
