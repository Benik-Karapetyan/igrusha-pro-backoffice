import { useMemo } from "react";

import { CopyToClipboard, CustomerStatusCell, TableAction, TableActionsCell, TableDateCell } from "@containers";
import { useCheckPermission } from "@hooks";
import { mdiMinus } from "@mdi/js";
import { useNavigate } from "@tanstack/react-router";
import { ENUM_CUSTOMER_RISK_LEVEL } from "@types";
import { HeaderItem, Icon, TableItem } from "@ui-kit";

export const useCustomerHeaders = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();

  const getRiskLevelText = (customerRiskLevel: ENUM_CUSTOMER_RISK_LEVEL) => {
    switch (customerRiskLevel) {
      case ENUM_CUSTOMER_RISK_LEVEL.Unknown:
        return "Unknown";
      case ENUM_CUSTOMER_RISK_LEVEL.Low:
        return "Low";
      case ENUM_CUSTOMER_RISK_LEVEL.Medium:
        return "Medium";
      case ENUM_CUSTOMER_RISK_LEVEL.High:
        return "High";
      case ENUM_CUSTOMER_RISK_LEVEL.Severe:
        return "Severe";
      default:
        return "";
    }
  };

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("customer_read")) tableActions.push("watch");
    if (checkPermission("customer_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const headers: HeaderItem[] = [
    {
      text: "customer id",
      value: (item: TableItem) =>
        typeof item.identityId === "string" && (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.identityId}>
              {item.identityId}
            </div>
            <CopyToClipboard text={item.identityId} size="iconSmall" />
          </div>
        ),
      width: 160,
      maxWidth: 160,
    },
    { text: "full name", value: "fullName", width: 210, maxWidth: 210 },
    { text: "email", value: "email", width: 210, maxWidth: 210 },
    { text: "country", value: "country", width: 155, maxWidth: 155 },
    { text: "kyc level", value: "kycLevel", width: 155, maxWidth: 155 },
    {
      text: "risk level",
      value: (item) =>
        typeof item.riskLevel === "number" ? getRiskLevelText(item.riskLevel) : <Icon name={mdiMinus} dense />,
      width: 155,
      maxWidth: 155,
    },
    {
      text: "customer status",
      value: (item) => typeof item?.status === "number" && <CustomerStatusCell status={item.status} />,
    },
    {
      text: "creation date",
      value: (item) => (
        <div className="flex items-center gap-1">
          {item.registrationDate && typeof item.registrationDate === "string" && (
            <TableDateCell date={item.registrationDate} />
          )}
          <TableActionsCell
            actions={actions}
            item={item}
            onWatch={(item) => navigate({ to: "/customers/$id", params: { id: String(item.id) } })}
            className="ml-auto"
          />
        </div>
      ),
    },
  ];

  return {
    headers,
  };
};
