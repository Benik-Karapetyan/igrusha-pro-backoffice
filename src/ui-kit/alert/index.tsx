import { FC } from "react";

import { mdiCheckboxMarkedCircle, mdiCloseBox, mdiCloseCircle } from "@mdi/js";
import { cn } from "@utils";

import { Icon } from "../icon";

const icons = {
  info: mdiCloseBox,
  progress: mdiCloseBox,
  warning: mdiCloseBox,
  success: mdiCheckboxMarkedCircle,
  error: mdiCloseCircle,
};

const textVariants = {
  info: "text-state-info-foreground-muted",
  progress: "text-state-progress-foreground-muted",
  warning: "text-state-warning-foreground-muted",
  success: "text-state-success-foreground-muted",
  error: "text-state-destructive-foreground-muted",
};

const variants = {
  info: "bg-state-info-background text-state-info-foreground border-state-info-border",
  progress: "bg-state-progress-background text-state-progress-foreground border-state-progress-border",
  warning: "bg-state-warning-background text-state-warning-foreground border-state-warning-border",
  success: "bg-state-success-background text-state-success-foreground border-state-success-border",
  error: "bg-state-destructive-background text-state-destructive-foreground border-state-destructive-border",
};

interface AlertProps {
  title?: string;
  text?: string;
  variant?: keyof typeof variants;
  className?: string;
}

export const Alert: FC<AlertProps> = ({ title, text, className, variant = "info" }) => {
  return (
    <div className={cn("flex w-fit items-center gap-3 rounded-2xl border px-6 py-4", variants[variant], className)}>
      <Icon name={icons[variant]} color="current" size={28} />

      <div className="flex flex-col">
        <h4 className="font-semibold">{title}</h4>
        <div className={cn("text-sm", textVariants[variant])}>{text}</div>
      </div>
    </div>
  );
};
