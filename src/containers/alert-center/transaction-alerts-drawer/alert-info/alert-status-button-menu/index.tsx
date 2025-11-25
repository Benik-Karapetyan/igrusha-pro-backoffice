import { useState } from "react";

import { ENUM_ALERT_STATUS } from "@types";
import { Button, Icon, Popover, PopoverContent, PopoverTrigger, Typography } from "@ui-kit";
import { editIcon } from "@utils";

interface IAlertStatusButtonMenuProps {
  status: ENUM_ALERT_STATUS;
  onStatusChange: (status: ENUM_ALERT_STATUS) => void;
}

export const AlertStatusButtonMenu = ({ status, onStatusChange }: IAlertStatusButtonMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="iconXSmall">
          <Icon name={editIcon} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-50 max-w-[120px] p-0" align="end">
        {status !== ENUM_ALERT_STATUS.New && (
          <div
            className="flex h-9 cursor-pointer items-center px-3 transition-all duration-200 hover:bg-background-surface"
            onClick={() => onStatusChange(ENUM_ALERT_STATUS.New)}
          >
            <Typography>New</Typography>
          </div>
        )}
        {status !== ENUM_ALERT_STATUS.InReview && (
          <div
            className="flex h-9 cursor-pointer items-center px-3 transition-all duration-200 hover:bg-background-surface"
            onClick={() => onStatusChange(ENUM_ALERT_STATUS.InReview)}
          >
            <Typography>In Review</Typography>
          </div>
        )}

        {status !== ENUM_ALERT_STATUS.Reviewed && (
          <div
            className="flex h-9 cursor-pointer items-center px-3 transition-all duration-200 hover:bg-background-surface"
            onClick={() => onStatusChange(ENUM_ALERT_STATUS.Reviewed)}
          >
            <Typography>Reviewed</Typography>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
