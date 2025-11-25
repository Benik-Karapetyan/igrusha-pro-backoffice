import { FC, HTMLProps } from "react";

import { mdiMinus } from "@mdi/js";
import { Icon } from "@ui-kit";
import { cn } from "@utils";

interface ReadOnlyFieldProps extends HTMLProps<HTMLDivElement> {
  label: string;
  value?: string | string[];
}

export const ReadOnlyField: FC<ReadOnlyFieldProps> = ({ label, value, className }) => {
  return (
    <div className={cn(className, "flex flex-col gap-1")}>
      <div className="text-sm font-semibold text-foreground-muted">{label}</div>
      {value ? (
        typeof value === "string" ? (
          <div className="text-sm">{value}</div>
        ) : (
          <div className="flex flex-wrap gap-1">
            {value?.map((name, i) => (
              <div key={i} className="rounded-xl bg-background-muted px-2 py-1 text-sm">
                {name}
              </div>
            ))}
          </div>
        )
      ) : (
        <Icon name={mdiMinus} dense className="-ml-[3px]" />
      )}
    </div>
  );
};
