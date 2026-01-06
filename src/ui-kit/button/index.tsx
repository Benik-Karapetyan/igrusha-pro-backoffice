import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@utils";
import { cva, type VariantProps } from "class-variance-authority";

import { ProgressCircular } from "../progress-circular";

const buttonVariants = cva(
  "inline-flex items-center tracking-wide justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-foreground-inverse shadow hover:bg-primary-hover active:bg-primary-dark disabled:bg-primary-disabled",
        outline:
          "border border-stroke-medium bg-background-subtle text-foreground-primary hover:bg-background-default active:bg-background-surface disabled:text-foreground-disabled",
        ghost:
          "text-foreground-primary hover:bg-background-default active:outline active:outline-stroke-medium active:bg-background-subtle disabled:text-foreground-disabled",
        text: "!px-0 !h-auto text-primary hover:text-primary-hover active:text-primary-dark disabled:text-primary-disabled",
        critical:
          "bg-error-primary text-foreground-inverse shadow hover:bg-error-hover active:bg-error-dark disabled:bg-error-disabled",
        textCritical:
          "!px-0 !h-auto bg-background-subtle text-error-primary hover:text-error-hover active:text-error-dark disabled:text-error-disabled",
        icon: "rounded-full bg-button-primary-foreground text-primary hover:bg-primary/10",
        link: "text-primary underline",
      },
      size: {
        default: "h-9 px-3",
        small: "h-7 px-3",
        icon: "h-9 w-9 min-h-9 min-w-9",
        iconSmall: "h-7 w-7 min-h-7 min-w-7",
        iconXSmall: "h-6 w-6 min-h-6 min-w-6",
        link: "h-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={props.type || "button"}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <ProgressCircular indeterminate size={20} /> : props.children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };
