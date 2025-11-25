import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

import { mdiCheckBold } from "@mdi/js";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@utils";

import { Icon } from "../icon";

interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  labelBold?: boolean;
  readOnly?: boolean;
}

const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, labelBold, readOnly, ...props }, ref) => (
    <div
      className={cn(
        "flex items-center gap-2",
        !readOnly && "cursor-pointer",
        props.disabled && "cursor-not-allowed opacity-50"
      )}
      onClick={
        readOnly
          ? undefined
          : (e) => {
              if (e.currentTarget === e.target) (e.currentTarget.children[0] as HTMLButtonElement).click();
            }
      }
    >
      <CheckboxPrimitive.Root
        ref={ref}
        id={label}
        className={cn(
          "peer h-5 w-5 shrink-0 rounded-sm border-2 bg-background-subtle shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:text-primary",
          readOnly && "pointer-events-none cursor-default",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
          <Icon name={mdiCheckBold} small color="current" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <label
          htmlFor={label}
          className={cn(
            "select-none text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            !readOnly && "cursor-pointer",
            labelBold && "font-semibold"
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
