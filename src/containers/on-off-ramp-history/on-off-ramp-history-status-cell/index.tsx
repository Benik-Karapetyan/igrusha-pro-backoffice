import { FC } from "react";

import { ENUM_ON_OFF_RAMP_STATUS } from "@types";
import { Chip, ChipTypes } from "@ui-kit";

interface OnOffRampHistoryStatusCellProps {
  status: ENUM_ON_OFF_RAMP_STATUS;
}

export const OnOffRampHistoryStatusCell: FC<OnOffRampHistoryStatusCellProps> = ({ status }) => {
  const getStatusType = (): ChipTypes => {
    switch (status) {
      case ENUM_ON_OFF_RAMP_STATUS.New:
      case ENUM_ON_OFF_RAMP_STATUS.Processing:
        return "future";
      case ENUM_ON_OFF_RAMP_STATUS.Failed:
      case ENUM_ON_OFF_RAMP_STATUS.InternalFailed:
      case ENUM_ON_OFF_RAMP_STATUS.Cancelled:
      case ENUM_ON_OFF_RAMP_STATUS.Rejected:
        return "blocked";
      case ENUM_ON_OFF_RAMP_STATUS.PendingProviderApproval:
        return "pending";
      case ENUM_ON_OFF_RAMP_STATUS.Finished:
      case ENUM_ON_OFF_RAMP_STATUS.PaySuccess:
        return "distributed";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ENUM_ON_OFF_RAMP_STATUS.New:
        return "New";
      case ENUM_ON_OFF_RAMP_STATUS.Processing:
        return "Processing";
      case ENUM_ON_OFF_RAMP_STATUS.Failed:
        return "Failed";
      case ENUM_ON_OFF_RAMP_STATUS.InternalFailed:
        return "Internal Failed";
      case ENUM_ON_OFF_RAMP_STATUS.Cancelled:
        return "Cancelled";
      case ENUM_ON_OFF_RAMP_STATUS.Rejected:
        return "Rejected";
      case ENUM_ON_OFF_RAMP_STATUS.PendingProviderApproval:
        return "Pending Provider Approval";
      case ENUM_ON_OFF_RAMP_STATUS.Finished:
        return "Finished";
      case ENUM_ON_OFF_RAMP_STATUS.PaySuccess:
        return "Pay Success";
      default:
        return "";
    }
  };

  return <Chip type={getStatusType()} title={getStatusText()} size="small"></Chip>;
};
