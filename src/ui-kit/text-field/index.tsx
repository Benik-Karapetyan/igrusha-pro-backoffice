import { ComponentProps, forwardRef, ReactNode, useMemo, useRef } from "react";

import { cn } from "@utils";

interface TextFieldProps extends ComponentProps<"input"> {
  label?: string;
  dense?: boolean;
  hint?: string;
  error?: boolean;
  errorMessage?: string;
  hideDetails?: boolean;
  prependInner?: ReactNode;
  appendInner?: ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      type,
      label,
      dense,
      hint,
      error,
      errorMessage,
      hideDetails = true,
      prependInner,
      appendInner,
      ...props
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasError = useMemo(() => error || !!errorMessage, [error, errorMessage]);

    const handleContainerClick = () => {
      if (containerRef.current) {
        const input = containerRef.current.querySelector("input") as HTMLInputElement;
        input.focus();
        if (input.type !== "number") {
          setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
        }
      }
    };

    return (
      <div className="flex flex-col gap-1.5 text-start">
        {label && (
          <label
            htmlFor={label}
            className={cn(
              "cursor-pointer select-none text-xs font-semibold text-foreground-secondary",
              props.disabled && "cursor-not-allowed"
            )}
          >
            {label}
            {props.required && <span className="text-error-primary"> *</span>}
          </label>
        )}

        <div
          className={cn(
            "flex flex-col gap-1.5",
            hideDetails ? (dense ? "min-h-[28px]" : "min-h-[36px]") : dense ? "min-h-[50px]" : "min-h-[58px]"
          )}
        >
          <div
            ref={containerRef}
            className={cn(
              "flex w-full cursor-text items-center rounded-md border border-stroke-medium px-3 transition-colors focus-within:ring-1",
              "bg-background-subtle",
              dense ? "h-[28px]" : "h-[36px]",
              props.disabled ? "cursor-not-allowed bg-background-default" : "hover:ring-1",
              hasError
                ? "border-error-primary focus-within:ring-error-primary"
                : "focus-within:border-primary focus-within:ring-primary",
              hasError && !props.disabled && "hover:border-error-primary hover:ring-error-primary",
              !hasError && !props.disabled && "hover:border-primary hover:ring-primary"
            )}
            onClick={handleContainerClick}
          >
            {prependInner && prependInner}

            <input
              ref={ref}
              id={label}
              type={type}
              className={cn(
                "h-full w-full rounded-xl bg-background-subtle text-sm",
                "placeholder:text-foreground-secondary focus-visible:outline-none disabled:placeholder:text-foreground-disabled",
                "disabled:cursor-not-allowed disabled:bg-background-default disabled:text-foreground-disabled",
                className
              )}
              onClick={(e) => e.stopPropagation()}
              {...props}
            />

            {hint && <span className="ml-2 text-xs text-foreground-secondary">{hint}</span>}

            {appendInner && appendInner}
          </div>

          {errorMessage && <span className="text-xs text-error-primary">{errorMessage}</span>}
        </div>
      </div>
    );
  }
);
TextField.displayName = "TextField";

export { TextField };
