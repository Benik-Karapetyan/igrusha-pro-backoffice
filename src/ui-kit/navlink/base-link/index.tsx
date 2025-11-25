import { FC } from "react";

import { cn } from "@utils";

import { Icon } from "../../icon";

interface BaseLinkProps {
  isActive: boolean;
  title: string;
  icon?: string;
}

export const BaseLink: FC<BaseLinkProps> = ({ isActive, title, icon }) => {
  return (
    <span
      className={cn(
        "inline-flex h-full w-full items-center gap-2 rounded-md px-2 text-sm transition-all duration-300 hover:bg-background-surface",
        isActive ? "text-primary" : ""
      )}
    >
      {isActive && <div className={cn("absolute left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-md bg-primary")} />}

      {icon && <Icon name={icon} color={isActive ? "icon-primary" : "icon-default"} />}

      <span>{title}</span>
    </span>
  );
};
