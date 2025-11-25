import { FC } from "react";

import { Tooltip, TooltipArrow, TooltipContent, TooltipProvider, TooltipTrigger, Typography } from "@ui-kit";
import { cn } from "@utils";

import { Icon } from "../../icon";

interface MiniLinkProps {
  title: string;
  isActive: boolean;
  icon?: string;
  open?: boolean;
}

export const MiniLink: FC<MiniLinkProps> = ({ title, isActive, icon, open }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="h-11 w-full">
          <span
            className={cn(
              "inline-flex h-8 items-center justify-center gap-2 rounded-md px-1 text-sm transition-all duration-300 hover:bg-background-surface",
              isActive ? "text-primary" : "",
              { "justify-start": open }
            )}
          >
            {isActive && (
              <div className={cn("absolute left-1 top-1/2 h-auto w-1 -translate-y-1/2 rounded-md bg-primary")} />
            )}

            {icon && <Icon name={icon} color={isActive ? "icon-primary" : "icon-default"} />}
          </span>
        </TooltipTrigger>
        <TooltipContent side="right">
          <TooltipArrow />
          <Typography variant="body-sm" color="inverse">
            {title}
          </Typography>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
