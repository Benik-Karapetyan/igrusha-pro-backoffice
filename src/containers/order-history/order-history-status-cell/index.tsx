import { FC } from "react";

import { ENUM_ORDER_HISTORY_STATUS } from "@types";
import { cn } from "@utils";

interface OrderHistoryStatusCellProps {
  status: ENUM_ORDER_HISTORY_STATUS;
}

export const OrderHistoryStatusCell: FC<OrderHistoryStatusCellProps> = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case ENUM_ORDER_HISTORY_STATUS.New:
        return "New";
      case ENUM_ORDER_HISTORY_STATUS.PartiallyFilled:
        return "Partially Filled";
      case ENUM_ORDER_HISTORY_STATUS.Filled:
        return "Filled";
      case ENUM_ORDER_HISTORY_STATUS.Canceled:
        return "Canceled";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case ENUM_ORDER_HISTORY_STATUS.New:
        return "text-state-success-foreground";
      case ENUM_ORDER_HISTORY_STATUS.PartiallyFilled:
        return "text-state-warning-foreground";
      case ENUM_ORDER_HISTORY_STATUS.Filled:
        return "text-state-success-foreground";
      case ENUM_ORDER_HISTORY_STATUS.Canceled:
        return "text-state-destructive-foreground";
      default:
        return "";
    }
  };

  return <div className={cn(getStatusColor())}>{getStatusText()}</div>;
};
