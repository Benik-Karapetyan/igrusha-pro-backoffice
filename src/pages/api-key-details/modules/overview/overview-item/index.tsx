import { ReactNode } from "react";

import { Typography } from "@ui-kit";
import { cn } from "@utils";

interface OverviewItemProps {
  title?: string;
  value?: ReactNode;
  className?: string;
}

export const OverviewItem = ({ title, value, className }: OverviewItemProps) => {
  return (
    <div className={cn("flex flex-col gap-1 border-r border-dashed pr-1 sm:w-full md:w-[calc(25%-12px)]", className)}>
      <Typography variant="body-sm">{title}</Typography>
      {value && (
        <Typography variant="heading-3" className="break-words">
          {value}
        </Typography>
      )}
    </div>
  );
};
