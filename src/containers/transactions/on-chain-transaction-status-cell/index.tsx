import { FC } from "react";

import { ENUM_ON_CHAIN_TRANSACTION_STATUS } from "@types";
import { Chip } from "@ui-kit";

interface OnChainTransactionStatusCellProps {
  status: ENUM_ON_CHAIN_TRANSACTION_STATUS;
}

export const OnChainTransactionStatusCell: FC<OnChainTransactionStatusCellProps> = ({ status }) => {
  const getStatusType = () => {
    switch (status) {
      case ENUM_ON_CHAIN_TRANSACTION_STATUS.Completed:
        return "distributed";
      case ENUM_ON_CHAIN_TRANSACTION_STATUS.Canceled:
        return "blocked";
      case ENUM_ON_CHAIN_TRANSACTION_STATUS.Pending:
        return "pending";
      case ENUM_ON_CHAIN_TRANSACTION_STATUS.InProgress:
        return "future";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ENUM_ON_CHAIN_TRANSACTION_STATUS.Completed:
        return "Completed";
      case ENUM_ON_CHAIN_TRANSACTION_STATUS.Canceled:
        return "Rejected";
      case ENUM_ON_CHAIN_TRANSACTION_STATUS.Pending:
        return "Pending";
      case ENUM_ON_CHAIN_TRANSACTION_STATUS.InProgress:
        return "In Progress";
      default:
        return "";
    }
  };

  return <Chip type={getStatusType()} title={getStatusText()} size="small"></Chip>;
};
