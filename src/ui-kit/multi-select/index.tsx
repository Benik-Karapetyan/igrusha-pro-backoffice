import { FC, useMemo } from "react";

import { ISelectItem } from "@types";
import { cn } from "@utils";

interface MultiSelectProps {
  value?: number[] | string[];
  label?: string;
  items?: ISelectItem[];
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  onClick?: () => void;
}

export const MultiSelect: FC<MultiSelectProps> = ({ value, label, items, disabled, error, errorMessage, onClick }) => {
  const hasError = useMemo(() => error || !!errorMessage, [error, errorMessage]);

  return (
    <div className="flex flex-col gap-1.5 text-start">
      {label && (
        <label
          htmlFor={label}
          className={cn(
            "cursor-pointer select-none text-xs font-semibold text-foreground-secondary",
            disabled && "cursor-not-allowed"
          )}
        >
          {label}
        </label>
      )}

      <div className="flex min-h-[58px] flex-col gap-0">
        <div
          className={cn(
            "flex min-h-[36px] w-full cursor-pointer flex-wrap items-center gap-1 rounded-md border bg-background-subtle px-4 py-2 transition-colors focus-within:ring-1",
            disabled && "cursor-not-allowed opacity-50",
            hasError
              ? "border-error-primary focus-within:ring-error-primary"
              : "focus-within:border-primary focus-within:ring-primary"
          )}
          onClick={onClick}
        >
          {value?.map((val, i) => (
            <div key={i} className="rounded-xl bg-background-muted px-2 py-1 text-sm">
              {items?.find((item) => item.id === val)?.name}
            </div>
          ))}
        </div>

        {errorMessage && <span className="text-xs text-error-primary">{errorMessage}</span>}
      </div>
    </div>
  );
};
