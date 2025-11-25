import { FC } from "react";

import { ENUM_ON_OFF_RAMP_GROUPED_STATUS } from "@types";
import { Chip, ChipTypes } from "@ui-kit";

interface OnOffRampHistoryStatusCellProps {
  status: ENUM_ON_OFF_RAMP_GROUPED_STATUS;
}

export const OnOffRampHistoryGroupedStatusCell: FC<OnOffRampHistoryStatusCellProps> = ({ status }) => {
  const getStatusType = (): ChipTypes => {
    switch (status) {
      case ENUM_ON_OFF_RAMP_GROUPED_STATUS.InProgress:
        return "future";
      case ENUM_ON_OFF_RAMP_GROUPED_STATUS.Pending:
        return "pending";
      case ENUM_ON_OFF_RAMP_GROUPED_STATUS.Completed:
        return "distributed";
      case ENUM_ON_OFF_RAMP_GROUPED_STATUS.Rejected:
        return "blocked";
      default:
        return "default";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ENUM_ON_OFF_RAMP_GROUPED_STATUS.InProgress:
        return "In Progress";
      case ENUM_ON_OFF_RAMP_GROUPED_STATUS.Pending:
        return "Pending";
      case ENUM_ON_OFF_RAMP_GROUPED_STATUS.Completed:
        return "Completed";
      case ENUM_ON_OFF_RAMP_GROUPED_STATUS.Rejected:
        return "Rejected";
      default:
        return "";
    }
  };

  return <Chip type={getStatusType()} title={getStatusText()} size="small"></Chip>;
};
