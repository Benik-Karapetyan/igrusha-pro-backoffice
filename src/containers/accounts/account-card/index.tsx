import { FC } from "react";

import { mdiEyeOff } from "@mdi/js";
import { Link, ToPathOption } from "@tanstack/react-router";
import {
  Button,
  Chip,
  Icon,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@ui-kit";
import { cn, viewIcon } from "@utils";

import { CopyToClipboard } from "../../copy-to-clipboard";

interface AccountCardProps {
  title: string;
  id: number;
  to: ToPathOption;
  active?: boolean;
  hidden?: boolean;
  onHide?: () => void;
}

export const AccountCard: FC<AccountCardProps> = ({ title, id, to, active, hidden, onHide }) => {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border bg-background-subtle p-3 shadow-[0px_2px_1px_0px_#0E121B0A]",
        hidden && "hidden"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Typography variant="heading-3">{title}</Typography>

          <div className="flex items-center gap-2">
            <Typography variant="body-sm" color="secondary">
              ID: {id}
            </Typography>

            <CopyToClipboard text={String(id)} size="iconXSmall" iconSize={20} iconColor="icon-disabled" />
          </div>
        </div>

        <Chip type={active ? "active" : "passive"} title={active ? "Active" : "Passive"} className="!w-[189px]" />
      </div>

      <div className="flex flex-col gap-3 border-l border-dashed pl-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={to}>
                <Button variant="ghost" size="iconSmall">
                  <Icon name={viewIcon} />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">
              <TooltipArrow />
              <Typography variant="body-sm" color="inverse">
                Details
              </Typography>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="iconSmall" onClick={onHide}>
                <Icon name={mdiEyeOff} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <TooltipArrow />
              <Typography variant="body-sm" color="inverse">
                Hide From View
              </Typography>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
