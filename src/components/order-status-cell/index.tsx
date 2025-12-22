import { FC } from "react";

import { ENUM_ORDER_STATUS } from "@types";
import { Chip, ChipTypes } from "@ui-kit";

interface OrderStatusCellProps {
  status: ENUM_ORDER_STATUS;
}

export const OrderStatusCell: FC<OrderStatusCellProps> = ({ status }) => {
  const getStatusText = (): string => {
    switch (status) {
      case ENUM_ORDER_STATUS.OnTheWay:
        return "On the way";
      case ENUM_ORDER_STATUS.Delivered:
        return "Delivered";
      case ENUM_ORDER_STATUS.Cancelled:
        return "Cancelled";
      case ENUM_ORDER_STATUS.ReturnPending:
        return "Return pending";
      case ENUM_ORDER_STATUS.Returned:
        return "Returned";
      default:
        return "";
    }
  };

  const getStatusType = (): ChipTypes => {
    switch (status) {
      case ENUM_ORDER_STATUS.OnTheWay:
        return "future";
      case ENUM_ORDER_STATUS.Delivered:
        return "active";
      case ENUM_ORDER_STATUS.Cancelled:
        return "blocked";
      case ENUM_ORDER_STATUS.ReturnPending:
        return "pending";
      case ENUM_ORDER_STATUS.Returned:
        return "blocked";
      default:
        return "default";
    }
  };

  return <Chip type={getStatusType()} title={getStatusText()} size="small"></Chip>;
};
