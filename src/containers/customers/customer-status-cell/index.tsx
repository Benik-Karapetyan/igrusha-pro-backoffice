import { FC } from "react";

import { ENUM_CUSTOMER_STATUS } from "@types";
import { Chip, ChipTypes } from "@ui-kit";

interface CustomerStatusCellProps {
  status: ENUM_CUSTOMER_STATUS;
}

export const CustomerStatusCell: FC<CustomerStatusCellProps> = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case ENUM_CUSTOMER_STATUS.Active:
        return "Active";
      case ENUM_CUSTOMER_STATUS.Dormant:
        return "Dormant";
      case ENUM_CUSTOMER_STATUS.Banned:
        return "Banned";
      case ENUM_CUSTOMER_STATUS.Closed:
        return "Closed";
      default:
        return "";
    }
  };

  const getStatusType = (): ChipTypes => {
    switch (status) {
      case ENUM_CUSTOMER_STATUS.Active:
        return "active";
      case ENUM_CUSTOMER_STATUS.Dormant:
        return "passive";
      case ENUM_CUSTOMER_STATUS.Banned:
        return "blocked";
      case ENUM_CUSTOMER_STATUS.Closed:
        return "closed";
      default:
        return "default";
    }
  };

  return <Chip type={getStatusType()} title={getStatusText()} size="small"></Chip>;
};
