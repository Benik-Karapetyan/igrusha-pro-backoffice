import { FC } from "react";

import { ENUM_TRADING_CONTEST_STATUS } from "@types";
import { Chip, ChipTypes } from "@ui-kit";

interface TradingContestStatusCellProps {
  status: ENUM_TRADING_CONTEST_STATUS;
}

export const TradingContestStatusCell: FC<TradingContestStatusCellProps> = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case ENUM_TRADING_CONTEST_STATUS.Future:
        return "Future";
      case ENUM_TRADING_CONTEST_STATUS.Active:
        return "Active";
      case ENUM_TRADING_CONTEST_STATUS.Finished:
        return "Finished";
      case ENUM_TRADING_CONTEST_STATUS.Distributed:
        return "Distributed";
      default:
        return "";
    }
  };

  const getStatusType = (): ChipTypes => {
    switch (status) {
      case ENUM_TRADING_CONTEST_STATUS.Future:
        return "future";
      case ENUM_TRADING_CONTEST_STATUS.Active:
        return "active";
      case ENUM_TRADING_CONTEST_STATUS.Finished:
        return "finished";
      case ENUM_TRADING_CONTEST_STATUS.Distributed:
        return "distributed";
      default:
        return "default";
    }
  };

  return <Chip type={getStatusType()} title={getStatusText()} size="small"></Chip>;
};
