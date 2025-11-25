import { FC, ReactNode } from "react";

import { cn } from "@utils";
import { VariantProps } from "class-variance-authority";

import { Icon } from "../icon";
import { Typography } from "../typography";
import { chipVariants } from "./chip.consts";

export type ChipTypes = NonNullable<VariantProps<typeof chipVariants>["type"]>;

interface ChipProps extends VariantProps<typeof chipVariants> {
  text?: string;
  className?: string;
  title: string;
  icon?: string;
  prependInner?: ReactNode;
  appendInner?: ReactNode;
  onClick?: () => void;
}

export const Chip: FC<ChipProps> = ({
  size,
  type,
  text,
  className,
  title,
  icon,
  prependInner,
  appendInner,
  onClick,
}) => {
  return (
    <div className={cn(chipVariants({ size, type, className }))} onClick={onClick}>
      {prependInner && icon && <Icon name={icon} />}

      <Typography variant={text ? "body-base" : "heading-4"}>{title ?? type}</Typography>
      {!!text && (
        <Typography variant="heading-4" color="link">
          {text}
        </Typography>
      )}

      {appendInner && icon && <Icon small name={icon} onClick={onClick} />}
    </div>
  );
};
