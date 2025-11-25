import { FC, HTMLProps, PropsWithChildren } from "react";

import { mdiMinus } from "@mdi/js";
import { Link } from "@tanstack/react-router";
import { Icon } from "@ui-kit";
import { cn } from "@utils";

interface DisplayFieldProps extends HTMLProps<HTMLDivElement> {
  label: string;
  value?: string;
  asLink?: boolean;
}

export const DisplayField: FC<PropsWithChildren<DisplayFieldProps>> = ({
  label,
  value,
  asLink,
  children,
  className,
}) => {
  return (
    <div className={cn("overflow-hidden text-ellipsis", className)}>
      <div className="font-semibold text-primary">{label}</div>
      {children ? (
        children
      ) : value ? (
        asLink ? (
          <Link to={value} target="_blank" className="text-primary underline">
            {value}
          </Link>
        ) : (
          <div className="flex items-center gap-1 text-sm">{value}</div>
        )
      ) : (
        <Icon name={mdiMinus} dense />
      )}
    </div>
  );
};
