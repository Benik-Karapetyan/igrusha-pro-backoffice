import { ChangeEvent, ComponentProps, forwardRef, useMemo } from "react";

import { cn } from "@utils";

interface TextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  maxCharacters?: number;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, maxCharacters, required, error, errorMessage, onChange, ...props }, ref) => {
    const hasError = useMemo(() => error || !!errorMessage, [error, errorMessage]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (maxCharacters) {
        if (e.target.value.length <= maxCharacters) onChange?.(e);
      } else {
        onChange?.(e);
      }
    };

    return (
      <div className="flex w-full flex-col gap-1.5 text-start">
        {label && (
          <label
            htmlFor={label}
            className={cn(
              "cursor-pointer select-none text-xs font-semibold text-foreground-secondary",
              props.disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
            {required && <span className="text-error-primary"> *</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={label}
          className={cn(
            "flex min-h-[120px] min-w-full resize-none rounded-md border border-stroke-medium px-3 py-2 text-sm",
            "bg-background-subtle disabled:cursor-not-allowed disabled:bg-background-default disabled:text-foreground-disabled",
            "not(disabled):hover:ring-1 placeholder:text-foreground-secondary focus-visible:outline-none focus-visible:ring-1 disabled:placeholder:text-foreground-disabled",
            hasError
              ? "not(disabled):hover:border-error-primary not(disabled):hover:ring-error-primary border-error-primary focus-within:ring-error-primary"
              : "not(disabled):hover:border-primary not(disabled):hover:ring-primary focus-visible:border-primary focus-visible:ring-primary",
            className
          )}
          onChange={handleChange}
          {...props}
        />

        {(errorMessage || maxCharacters) && (
          <div className={cn("flex gap-3", errorMessage ? "justify-between" : "justify-end")}>
            {errorMessage && <span className="text-xs text-error-primary">{errorMessage}</span>}
            {maxCharacters && (
              <span className="text-xs text-foreground-secondary">
                {typeof props.value === "string" ? props.value.length : 0}/{maxCharacters}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
