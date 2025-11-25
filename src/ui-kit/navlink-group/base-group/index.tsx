import { FC } from "react";

import { mdiChevronDown } from "@mdi/js";
import { cn } from "@utils";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../collapsible";
import { Icon } from "../../icon";
import { NavLink } from "../../navlink";

interface BaseGroupProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  isActive: boolean;
  title: string;
  icon?: string;
  children: { title: string; url: string }[];
}

export const BaseGroup: FC<BaseGroupProps> = ({ open, onOpenChange, isActive, title, icon, children }) => {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="group/collapsible">
      <CollapsibleTrigger className="relative flex h-11 w-full items-center px-4">
        <span
          className={cn(
            "inline-flex h-8 w-full items-center gap-2 whitespace-nowrap rounded-md px-2 text-sm transition-all duration-300 hover:bg-background-surface",
            isActive ? "text-primary" : ""
          )}
        >
          {isActive && <div className="absolute left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-md bg-primary" />}

          {icon && <Icon name={icon} color={isActive ? "current" : "icon-default"} />}

          <span>{title}</span>

          <Icon
            name={mdiChevronDown}
            color={isActive ? "current" : "icon-default"}
            className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
          />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {children.map((subLink) => (
          <NavLink key={subLink.title} link={subLink} variant="sub" />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
