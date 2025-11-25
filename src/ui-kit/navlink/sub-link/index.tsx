import { FC } from "react";

import { cn } from "@utils";

import { Icon } from "../../icon";

interface SubLinkProps {
  isActive: boolean;
  title: string;
  icon?: string;
}

export const SubLink: FC<SubLinkProps> = ({ isActive, title, icon }) => {
  return (
    <span
      className={cn(
        "inline-flex h-full w-full items-center gap-2 rounded-md pl-10 pr-2 text-sm transition-all duration-300 hover:bg-background-surface",
        isActive && "text-primary"
      )}
    >
      {isActive && (
        <img src="../../dot.svg" alt="" className="absolute left-[31px] top-1/2 h-2.5 w-2.5 -translate-y-1/2" />
      )}

      {icon && <Icon name={icon} color={isActive ? "icon-primary" : "icon-default"} />}

      <span>{title}</span>
    </span>
  );
};
