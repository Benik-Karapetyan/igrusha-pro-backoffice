import { FC } from "react";

import { ENUM_PAYMENT_HISTORY_STATUS } from "@types";
import { cn } from "@utils";

interface PaymentHistoryStatusCellProps {
  status: ENUM_PAYMENT_HISTORY_STATUS;
}

export const PaymentHistoryStatusCell: FC<PaymentHistoryStatusCellProps> = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case ENUM_PAYMENT_HISTORY_STATUS.New:
        return "NEW";
      case ENUM_PAYMENT_HISTORY_STATUS.Processing:
        return "Processing";
      case ENUM_PAYMENT_HISTORY_STATUS.Failed:
        return "Failed";
      case ENUM_PAYMENT_HISTORY_STATUS.InternalFailed:
        return "Internal Failed";
      case ENUM_PAYMENT_HISTORY_STATUS.Cancelled:
        return "Cancelled";
      case ENUM_PAYMENT_HISTORY_STATUS.Rejected:
        return "Rejected";
      case ENUM_PAYMENT_HISTORY_STATUS.PendingProviderApproval:
        return "Pending Provider Approval";
      case ENUM_PAYMENT_HISTORY_STATUS.Success:
        return "Success";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case ENUM_PAYMENT_HISTORY_STATUS.New:
      case ENUM_PAYMENT_HISTORY_STATUS.Success:
        return "text-state-success-foreground";
      case ENUM_PAYMENT_HISTORY_STATUS.Processing:
      case ENUM_PAYMENT_HISTORY_STATUS.PendingProviderApproval:
        return "text-state-warning-foreground";
      case ENUM_PAYMENT_HISTORY_STATUS.Failed:
      case ENUM_PAYMENT_HISTORY_STATUS.InternalFailed:
      case ENUM_PAYMENT_HISTORY_STATUS.Cancelled:
      case ENUM_PAYMENT_HISTORY_STATUS.Rejected:
        return "text-state-destructive-foreground";
      default:
        return "";
    }
  };

  return <div className={cn(getStatusColor())}>{getStatusText()}</div>;
};
