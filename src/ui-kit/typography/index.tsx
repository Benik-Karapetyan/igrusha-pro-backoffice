import * as React from "react";
import { FC, PropsWithChildren } from "react";

import { cn, typographyColors, TypographyColors } from "@utils";

type TypographyVariants =
  | "link"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "body-sm"
  | "body-base"
  | "body-lg"
  | "body-2xl";

export interface TypographyProps {
  variant?: TypographyVariants;
  className?: string;
  color?: keyof TypographyColors;
  as?: React.ElementType;
  onClick?: (key: string | number) => void;
  dangerouslySetInnerHTML?: { __html: string };
}

const variantConfig: Record<TypographyVariants, { component: string; as: React.ElementType }> = {
  link: { component: "text-sm normal", as: "span" },
  "heading-2": { component: "text-2xl font-semibold leading-[30px]", as: "h2" },
  "heading-3": { component: "text-base font-semibold", as: "h3" },
  "heading-4": { component: "text-sm font-semibold", as: "h4" },
  "heading-5": { component: "text-xs font-semibold", as: "h5" },
  "body-sm": { component: "text-xs", as: "p" },
  "body-base": { component: "text-sm", as: "p" },
  "body-lg": { component: "text-base font-semibold", as: "p" },
  "body-2xl": { component: "text-2xl font-normal leading-[30px]", as: "p" },
};

export const Typography: FC<PropsWithChildren<TypographyProps>> = ({
  variant = "body-base",
  className,
  color = "primary",
  children,
  as,
  onClick,
  dangerouslySetInnerHTML,
}) => {
  const { component, as: defaultComponent } = variantConfig[variant];
  const Component = as ?? defaultComponent;

  return (
    <Component
      className={cn(component, typographyColors[color], className)}
      onClick={onClick}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {children}
    </Component>
  );
};
