import { FC } from "react";

import { cn } from "@utils";

import { Icon } from "../../icon";
import { NavLink } from "../../navlink";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { Typography } from "../../typography";

interface MiniGroupProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  isActive: boolean;
  title: string;
  icon?: string;
  children: { title: string; url: string }[];
}

export const MiniGroup: FC<MiniGroupProps> = ({ open, onOpenChange, isActive, title, icon, children }) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger className="relative flex h-11 w-full items-center px-3 !outline-none">
        <span
          className={cn(
            "inline-flex h-8 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md px-0 text-sm transition-all duration-300 hover:bg-background-surface",
            isActive ? "text-primary" : ""
          )}
        >
          {isActive && <div className="absolute left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-md bg-primary" />}

          {icon && <Icon name={icon} color={isActive ? "current" : "icon-default"} />}
        </span>
      </PopoverTrigger>
      <PopoverContent side="right" align="start">
        <div
          className={cn("rounded-sm bg-background-alt")}
          style={{
            boxShadow: "0px 2px 4px 0px rgba(14, 18, 27, 0.10)",
          }}
        >
          {open ? (
            <Typography variant="heading-4" className={cn("h-10 border-b p-3 text-primary")}>
              {title}
            </Typography>
          ) : null}

          {children.map((subLink) => (
            <NavLink key={subLink.title} link={subLink} open={open} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
