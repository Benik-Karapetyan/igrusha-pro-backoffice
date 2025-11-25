import { useCheckPermission } from "@hooks";
import { useStore } from "@store";
import { Link } from "@tanstack/react-router";
import { ENUM_CUSTOMER_KYC_STATUS, ENUM_CUSTOMER_RISK_LEVEL } from "@types";
import { Button, ChipTypes, Icon, Switch, TextCell, Typography } from "@ui-kit";
import { editIcon, splitCamelCase } from "@utils";
import { format } from "date-fns";

interface ComplianceOverviewCardProps {
  onRiskLevelClick: () => void;
  onVipLevelClick: () => void;
  onPepClick: () => void;
}

export const ComplianceOverviewCard = (props: ComplianceOverviewCardProps) => {
  const { onRiskLevelClick, onVipLevelClick, onPepClick } = props;
  const { checkPermission } = useCheckPermission();
  const customerComplianceOverview = useStore((s) => s.customerComplianceOverview);

  const getKycStatusChipType = (): ChipTypes => {
    switch (customerComplianceOverview?.kycStatus) {
      case ENUM_CUSTOMER_KYC_STATUS.NotSubmitted:
        return "passive";
      case ENUM_CUSTOMER_KYC_STATUS.DocumentsRequested:
        return "finished";
      case ENUM_CUSTOMER_KYC_STATUS.CheckCompleted:
        return "distributed";
      case ENUM_CUSTOMER_KYC_STATUS.Approved:
        return "active";
      case ENUM_CUSTOMER_KYC_STATUS.Rejected:
        return "blocked";
      case ENUM_CUSTOMER_KYC_STATUS.ResubmissionRequested:
        return "finished";
      case ENUM_CUSTOMER_KYC_STATUS.RequiresAction:
        return "finished";
      case ENUM_CUSTOMER_KYC_STATUS.Pending:
        return "pending";
      default:
        return "default";
    }
  };

  const getRiskLevelText = () => {
    switch (customerComplianceOverview?.customerRiskLevel) {
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

  return (
    <div className="rounded-xl border bg-background-subtle p-4">
      <div className="flex flex-wrap gap-4">
        <TextCell title="KYC Level" value={customerComplianceOverview?.kycLevel} className="w-[calc(25%_-_0.75rem)]" />
        <TextCell
          title="KYC Status"
          chipTitle={splitCamelCase(customerComplianceOverview?.kycStatus || "")}
          chipType={getKycStatusChipType()}
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="Customer Risk Level"
          value={getRiskLevelText()}
          appendInner={
            <Button variant="ghost" size="iconXSmall" onClick={onRiskLevelClick}>
              <Icon name={editIcon} />
            </Button>
          }
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="Country Risk Level"
          value={customerComplianceOverview?.countryRiskLevel || "-"}
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="VIP Level"
          value={customerComplianceOverview?.vipLevel || "-"}
          appendInner={
            <Button variant="ghost" size="iconXSmall" onClick={onVipLevelClick}>
              <Icon name={editIcon} />
            </Button>
          }
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="Residential Address"
          value={customerComplianceOverview?.residentialAddress || "-"}
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="Region ID"
          value={customerComplianceOverview?.regionId || "-"}
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="Last Login Country"
          value={customerComplianceOverview?.lastLoginCountry || "-"}
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="Last IP Used"
          value={customerComplianceOverview?.lastIPUsed || "-"}
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="Applicant ID"
          value={customerComplianceOverview?.applicantId || "-"}
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="Applicant Link"
          value={
            customerComplianceOverview?.applicantLink ? (
              <Link
                to={customerComplianceOverview.applicantLink}
                className="overflow-hidden text-ellipsis"
                target="_blank"
              >
                <Typography variant="link" color="link" className="font-semibold">
                  {customerComplianceOverview.applicantLink}
                </Typography>
              </Link>
            ) : (
              "-"
            )
          }
          className="w-[calc(25%_-_0.75rem)]"
          restrictWidth={false}
        />
        <TextCell
          title="Next Review Date"
          value={
            customerComplianceOverview?.nextReviewDate
              ? format(new Date(customerComplianceOverview.nextReviewDate), "yyyy-MM-dd HH:mm")
              : "-"
          }
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="PEP Status"
          value={customerComplianceOverview?.pepStatus || "-"}
          appendInner={
            checkPermission("customer_profile_compliance_update") &&
            customerComplianceOverview?.pepStatus && (
              <Switch checked={customerComplianceOverview?.pepStatus === "Yes"} onClick={onPepClick} />
            )
          }
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="2FA Status"
          value={customerComplianceOverview?.twoFactorEnabled ? "Enabled" : "Disabled"}
          hasBorder={false}
          className="w-[calc(25%_-_0.75rem)]"
        />
      </div>
    </div>
  );
};
