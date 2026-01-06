import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Colors {
  transparent: "text-transparent";
  current: "text-currentColor";
  "icon-primary": "text-icon-primary";
  "icon-default": "text-icon-default";
  "icon-disabled": "text-icon-disabled";
  "icon-high-contrast": "text-icon-high-contrast";
  "icon-error": "text-error-primary";
  "icon-success": "text-success-primary";
  "icon-warning": "text-warning-primary";
}

export const colors: Colors = {
  transparent: "text-transparent",
  current: "text-currentColor",
  "icon-primary": "text-icon-primary",
  "icon-default": "text-icon-default",
  "icon-disabled": "text-icon-disabled",
  "icon-high-contrast": "text-icon-high-contrast",
  "icon-error": "text-error-primary",
  "icon-success": "text-success-primary",
  "icon-warning": "text-warning-primary",
};

export interface TypographyColors {
  primary: "text-foreground-primary";
  secondary: "text-foreground-secondary";
  disabled: "text-foreground-disabled";
  inverse: "text-foreground-inverse";
  link: "text-primary";
  success: "text-success-primary";
  warning: "text-warning-primary";
  error: "text-error-primary";
}

export const typographyColors: TypographyColors = {
  primary: "text-foreground-primary",
  secondary: "text-foreground-secondary",
  disabled: "text-foreground-disabled",
  inverse: "text-foreground-inverse",
  link: "text-primary",
  success: "text-success-primary",
  warning: "text-warning-primary",
  error: "text-error-primary",
};
