import { useEffect, useState } from "react";

import { suspendActions } from "@forms";
import { mdiChevronDown, mdiInformation } from "@mdi/js";
import { ENUM_CUSTOMER_STATUS, ICustomerMainInfo } from "@types";
import {
  Button,
  Chip,
  ChipTypes,
  Collapsible,
  CollapsibleContent,
  Icon,
  TextCell,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@ui-kit";
import { cn } from "@utils";
import { format } from "date-fns";

import { CopyToClipboard } from "../../copy-to-clipboard";

interface CustomerMainInfoCardProps {
  customerMainInfo: ICustomerMainInfo;
}

export const CustomerMainInfoCard = (props: CustomerMainInfoCardProps) => {
  const { customerMainInfo } = props;
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
    localStorage.setItem("customerMainInfoOpen", JSON.stringify(!open));
  };

  const getStatusText = () => {
    switch (customerMainInfo?.status) {
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

  const getStatusChipType = (): ChipTypes => {
    switch (customerMainInfo?.status) {
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

  useEffect(() => {
    const open = localStorage.getItem("customerMainInfoOpen");
    if (open) setOpen(JSON.parse(open));
  }, []);

  return (
    <div className="relative flex flex-col gap-4 rounded-xl border bg-background-subtle p-4">
      <div className="flex flex-wrap gap-4">
        <TextCell title="Full Name" value={customerMainInfo.fullName} className="w-[calc(25%_-_0.75rem)]" />
        <TextCell
          title="Customer ID"
          value={String(customerMainInfo.identityId)}
          appendInner={<CopyToClipboard text={String(customerMainInfo.identityId)} size="iconXSmall" />}
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="Email Address"
          value={customerMainInfo.emailAddress}
          appendInner={<CopyToClipboard text={customerMainInfo.emailAddress} size="iconXSmall" />}
          className="w-[calc(25%_-_0.75rem)]"
        />
        <TextCell
          title="Country"
          value={customerMainInfo.country || "-"}
          hasBorder={false}
          className="w-[calc(25%_-_0.75rem)]"
        />
      </div>

      {open && (
        <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible w-full">
          <CollapsibleContent className="flex flex-wrap gap-4">
            <TextCell
              title="Date of Birth"
              value={customerMainInfo.dateOfBirth ? format(new Date(customerMainInfo.dateOfBirth), "dd.MM.yyyy") : "-"}
              className="w-[calc(25%_-_0.75rem)]"
            />
            <TextCell title="Mobile Number" value={customerMainInfo.phone || "-"} className="w-[calc(25%_-_0.75rem)]" />
            <TextCell
              title="Account Creation Date"
              value={format(new Date(customerMainInfo.accountCreationDate), "dd.MM.yyyy")}
              className="w-[calc(25%_-_0.75rem)]"
            />
            <TextCell
              title="Last Login Date"
              value={
                customerMainInfo.lastLoginDate
                  ? format(new Date(customerMainInfo.lastLoginDate), "dd.MM.yyyy HH:mm")
                  : "-"
              }
              hasBorder={false}
              className="w-[calc(25%_-_0.75rem)]"
            />
            <TextCell
              title="Customer Status"
              chipTitle={getStatusText()}
              chipType={getStatusChipType()}
              hasBorder={!!customerMainInfo.restrictedActions.length}
              className="w-[calc(25%_-_0.75rem)]"
            />
            {!!customerMainInfo.restrictedActions.length && (
              <TextCell
                title="Suspended Status"
                value={
                  <div className="flex grow items-center gap-2">
                    <Chip title="Suspended" type="finished" size="small" />

                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                          <Icon name={mdiInformation} />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <TooltipArrow />

                          <div className="flex flex-col gap-2">
                            {customerMainInfo.restrictedActions.map((action) => (
                              <Typography key={action} variant="body-sm" color="inverse">
                                {suspendActions.find((a) => a.id === action)?.name}
                              </Typography>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                }
                hasBorder={false}
                className="w-[calc(25%_-_0.75rem)]"
              />
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      <Button variant="outline" size="iconSmall" className="absolute bottom-3 right-3" onClick={handleToggle}>
        <Icon name={mdiChevronDown} className={cn("transition-all duration-200", open && "rotate-180")} />
      </Button>
    </div>
  );
};
