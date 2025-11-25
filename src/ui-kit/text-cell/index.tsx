import { ReactNode } from "react";

import { cn } from "@utils";

import { Chip, ChipTypes } from "../chip";
import { Typography } from "../typography";

interface TextCellProps {
  variant?: "col" | "row";
  title: string;
  value?: string | ReactNode;
  prependInner?: ReactNode;
  appendInner?: ReactNode;
  chipType?: ChipTypes;
  chipTitle?: string;
  hint?: string;
  hasBorder?: boolean;
  restrictWidth?: boolean;
  className?: string;
}

export const TextCell = (props: TextCellProps) => {
  const {
    variant = "col",
    title,
    value,
    prependInner,
    appendInner,
    chipType,
    chipTitle,
    hint,
    hasBorder = true,
    restrictWidth = true,
    className,
  } = props;

  return (
    <div
      className={cn(
        "flex select-text",
        variant === "col" ? "flex-col gap-1 pr-2" : "flex-row gap-2",
        hasBorder && "border-r border-dashed",
        className
      )}
    >
      <Typography
        variant="body-sm"
        color="secondary"
        className={cn(variant === "row" && "mt-0.5 grow whitespace-nowrap")}
      >
        {title}
      </Typography>

      <div className={cn("flex items-center gap-2", variant === "row" && "grow justify-end text-end")}>
        {prependInner && prependInner}

        <div
          className={cn(
            "flex grow items-center gap-2",
            variant === "row" && "justify-end",
            restrictWidth ? "max-w-[calc(100%_-_2rem)]" : "max-w-full"
          )}
          title={typeof value === "string" && restrictWidth ? value : undefined}
        >
          {typeof value === "string" ? (
            <div className={cn("flex w-full items-center gap-2", variant === "row" && "justify-end")}>
              <Typography
                variant="heading-4"
                className={cn("overflow-hidden text-ellipsis", restrictWidth ? "whitespace-nowrap" : "")}
                as="div"
              >
                {value}
              </Typography>
            </div>
          ) : (
            value
          )}

          {chipTitle && <Chip title={chipTitle} type={chipType} size="small" />}
        </div>

        {appendInner && appendInner}
      </div>

      {hint && (
        <Typography variant="body-sm" color="secondary" className="ml-auto">
          {hint}
        </Typography>
      )}
    </div>
  );
};
