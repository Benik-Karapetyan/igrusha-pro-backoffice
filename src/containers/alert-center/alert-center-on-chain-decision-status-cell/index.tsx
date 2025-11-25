import { FC } from "react";

import { ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS } from "@types";
import { Chip } from "@ui-kit";

interface AlertCenterOnChainDecisionStatusCellProps {
  status: ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS;
}

export const AlertCenterOnChainDecisionStatusCell: FC<AlertCenterOnChainDecisionStatusCellProps> = ({ status }) => {
  const getStatusType = () => {
    switch (status) {
      case ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS.Pending:
        return "pending";
      case ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS.Completed:
        return "distributed";
      case ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS.Rejected:
        return "blocked";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS.Pending:
        return "Pending";
      case ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS.Completed:
        return "Completed";
      case ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS.Rejected:
        return "Rejected";
      default:
        return "";
    }
  };

  return <Chip type={getStatusType()} title={getStatusText()} size="small"></Chip>;
};
