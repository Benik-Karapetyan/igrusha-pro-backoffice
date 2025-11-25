import { cva } from "class-variance-authority";

export const chipVariants = cva("flex w-[max-content] items-center rounded-md gap-2 px-2 justify-center", {
  variants: {
    type: {
      default: "bg-primary-light",
      active: "bg-success-disabled",
      blocked: "bg-error-disabled",
      passive: "bg-background-emphasis",
      future: "bg-info-disabled",
      finished: "bg-warning-disabled",
      distributed: "bg-stable-disabled",
      closed: "bg-foreground-disabled",
      pending: "bg-pending-disabled",
      "title-value": "bg-primary-light justify-between",
    },
    size: {
      small: "h-7",
      default: "h-9",
    },
  },
  defaultVariants: {
    type: "default",
    size: "default",
  },
});
