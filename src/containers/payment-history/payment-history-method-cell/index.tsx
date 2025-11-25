import { FC } from "react";

import { ENUM_PAYMENT_HISTORY_ORDER_TYPE } from "@types";

interface PaymentHistoryMethodCellProps {
  status: ENUM_PAYMENT_HISTORY_ORDER_TYPE;
}

export const PaymentHistoryMethodCell: FC<PaymentHistoryMethodCellProps> = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case ENUM_PAYMENT_HISTORY_ORDER_TYPE.Buy:
        return "Buy";
      case ENUM_PAYMENT_HISTORY_ORDER_TYPE.Sell:
        return "Sell";
      case ENUM_PAYMENT_HISTORY_ORDER_TYPE.Refund:
        return "Refund";
      default:
        return "";
    }
  };

  return <div>{getStatusText()}</div>;
};
