import { useState } from "react";

import { mdiDotsVertical } from "@mdi/js";
import { Button, Icon, Popover, PopoverContent, PopoverTrigger, Typography } from "@ui-kit";
import { cn } from "@utils";

interface ActionsButtonProps {
  onApprove: () => void;
  onReject: () => void;
}

export const ActionsButton = ({ onApprove, onReject }: ActionsButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className={cn("w-[100px] gap-0", open && "bg-primary-dark hover:bg-primary-dark")}>
          Actions
          <Icon name={mdiDotsVertical} color="current" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="z-50 max-w-[120px] p-0" align="end">
        <div
          className="flex h-9 cursor-pointer items-center px-3 transition-all duration-200 hover:bg-background-surface"
          onClick={() => {
            onApprove();
            setOpen(false);
          }}
        >
          <Typography>Approve</Typography>
        </div>
        <div
          className="flex h-9 cursor-pointer items-center px-3 transition-all duration-200 hover:bg-background-surface"
          onClick={() => {
            onReject();
            setOpen(false);
          }}
        >
          <Typography>Reject</Typography>
        </div>
      </PopoverContent>
    </Popover>
  );
};
