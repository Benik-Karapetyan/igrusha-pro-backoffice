import { useMemo } from "react";

import { useStore } from "@store";
import { ENUM_CUSTOMER_STATUS } from "@types";
import { Alert } from "@ui-kit";

export const CustomerStatusIndicator = () => {
  const status = useStore((s) => s.customer.status);

  const statusText = useMemo(() => {
    switch (status) {
      case ENUM_CUSTOMER_STATUS.Active:
        return "Current status: Active";
      case ENUM_CUSTOMER_STATUS.Dormant:
        return "Current status: Dormant";
      case ENUM_CUSTOMER_STATUS.Banned:
        return "Current status: Banned";
      case ENUM_CUSTOMER_STATUS.Closed:
        return "Current status: Closed";
      default:
        return "";
    }
  }, [status]);

  if (!status) return null;

  return (
    <Alert
      variant={status === ENUM_CUSTOMER_STATUS.Active ? "success" : "error"}
      text={statusText}
      className="w-full"
    />
  );
};
