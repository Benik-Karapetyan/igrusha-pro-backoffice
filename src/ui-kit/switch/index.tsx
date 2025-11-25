import * as React from "react";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & { label?: string; labelSide?: "left" | "right" }
>(({ className, label, labelSide = "right", ...props }, ref) => (
  <span className="inline-flex items-center gap-2">
    {label && labelSide === "left" && (
      <label htmlFor={label} className="cursor-pointer text-sm">
        {label}
      </label>
    )}

    <SwitchPrimitives.Root
      id={label}
      className={cn(
        "peer inline-flex h-4 w-[28px] shrink-0 cursor-pointer items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-background-emphasis data-[state=checked]:hover:bg-primary-hover",
        "disabled:cursor-not-allowed data-[state=checked]:disabled:bg-primary-disabled data-[state=unchecked]:disabled:bg-background-surface",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-3 w-3 rounded-full bg-background-subtle shadow-lg ring-0 transition-transform",
          "data-[state=checked]:translate-x-3.5 data-[state=unchecked]:translate-x-0.5"
        )}
      >
        <div
          className={cn(
            "absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full",
            props.checked ? "bg-primary" : "bg-background-emphasis",
            props.disabled ? (props.checked ? "bg-primary-disabled" : "bg-background-surface") : ""
          )}
        />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>

    {label && labelSide === "right" && (
      <label htmlFor={label} className="cursor-pointer text-sm">
        {label}
      </label>
    )}
  </span>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
