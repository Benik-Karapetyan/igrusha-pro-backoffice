import * as React from "react";
import { useMemo } from "react";

import { ISelectItem } from "@types";
import { Chip, Icon, Typography } from "@ui-kit";
import { chevronIcon, closeIcon, cn } from "@utils";

interface MultiSelectProps {
  open: boolean;
  label?: string;
  selectedItems?: (number | string)[];
  items?: ISelectItem[];
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  onTagClick?: (event: React.MouseEvent<HTMLDivElement>, value?: number | string) => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const MultiSelectInput = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    { open, label, selectedItems, items = [], disabled, error, errorMessage, placeholder, onTagClick, onClick },
    ref
  ) => {
    const hasError = error || !!errorMessage;

    const selectedOptions = useMemo(() => {
      const selected = selectedItems
        ?.map((val) => items.find((item) => item.id === val && item.id !== 0))
        .filter(Boolean) as ISelectItem[];

      const renderTag = (item: ISelectItem, i: number | string) => (
        <div key={i} onClick={(event) => onTagClick?.(event, item.id)}>
          <Chip key={i} type="default" title={item.name as string} size="small" icon={closeIcon} appendInner />
        </div>
      );

      if (!selected) return null;

      return selected.length > 3
        ? [
            ...selected.slice(0, 3).map(renderTag),
            <div key="remaining" onClick={(event) => onTagClick?.(event, "remaining")}>
              <Chip
                key="remaining"
                type="default"
                title={`+${selected.length - 3}`}
                icon={closeIcon}
                size="small"
                appendInner
              />
            </div>,
          ]
        : selected.map(renderTag);
    }, [items, selectedItems, onTagClick]);

    return (
      <div ref={ref} className="flex min-h-9 flex-col gap-1 text-start" onClick={onClick}>
        {label && (
          <label
            htmlFor={label}
            className={cn("cursor-pointer select-none", disabled && "cursor-not-allowed opacity-50")}
          >
            <Typography variant="heading-5" color="secondary">
              {label}
            </Typography>
          </label>
        )}

        <div
          className={cn(
            "flex min-h-9 w-full flex-wrap items-center gap-2 rounded-md border bg-background-alt px-3 transition-colors",
            open && "border-stroke-focus shadow-[0px_0px_2px_0px_#3E63DD] ring-1 ring-stroke-focus",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
            hasError ? "border-error focus-within:ring-error" : "focus-within:border-primary focus-within:ring-primary"
          )}
        >
          {!selectedItems?.length && (
            <Typography variant="body-base" color="secondary">
              {placeholder}
            </Typography>
          )}

          <div className="flex flex-1 flex-wrap gap-1">{selectedOptions}</div>

          <Icon name={chevronIcon} className={cn("-rotate-90 transition-transform", { "rotate-90": open })} />
        </div>

        {errorMessage && <span className="text-xs text-error">{errorMessage}</span>}
      </div>
    );
  }
);
