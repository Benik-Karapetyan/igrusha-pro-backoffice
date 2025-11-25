import * as React from "react";
import { useMemo, useRef, useState } from "react";

import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import * as SelectPrimitive from "@radix-ui/react-select";
import { checkIcon, cn, searchIcon } from "@utils";

import { Icon } from "../icon";
import { Typography } from "../typography";

const SelectRoot = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & { open: boolean }
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-[36px] w-full items-center justify-between rounded-md border bg-static-white px-3 text-sm ring-offset-background focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <Icon
          name={mdiChevronDown}
          color="icon-default"
          className={cn("transition-transform", props.open && "rotate-180")}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <Icon name={mdiChevronUp} color="icon-default" className="opacity-50" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <Icon name={mdiChevronDown} color="icon-default" className="opacity-50" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 overflow-hidden rounded-xl border bg-static-white shadow-md",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-lg py-3 pl-3 pr-2 text-sm outline-none hover:bg-background-default data-[disabled]:pointer-events-none data-[state=checked]:font-semibold data-[state=checked]:text-primary data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

    <span className="absolute right-4 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Icon name={checkIcon} color="icon-success" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("bg-muted -mx-1 my-1 h-px", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectRoot> {
  value?: string;
  label?: string;
  placeholder?: string;
  items?: { [key: string]: string | number }[];
  width?: string | number;
  readOnly?: boolean;
  required?: boolean;
  disabled?: boolean;
  dense?: boolean;
  hasSearch?: boolean;
  error?: boolean;
  errorMessage?: string;
  hideDetails?: boolean;
  prependInner?: React.ReactNode;
  appendInner?: React.ReactNode;
  onValueChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  value,
  label,
  placeholder,
  items,
  width,
  readOnly,
  required,
  disabled,
  dense,
  hasSearch,
  error,
  errorMessage,
  hideDetails,
  onValueChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const filteredItems = useMemo(
    () =>
      searchValue
        ? items?.filter((item) => (item.name as string).toLowerCase().includes(searchValue.toLowerCase()))
        : items,
    [searchValue, items]
  );
  const hasError = React.useMemo(() => error || !!errorMessage, [error, errorMessage]);

  return (
    <div className="flex flex-col gap-1.5 text-start">
      {label && (
        <label
          className={cn(
            "cursor-pointer select-none text-xs font-semibold text-foreground-secondary",
            readOnly && "pointer-events-none",
            disabled && "pointer-events-none cursor-not-allowed opacity-50"
          )}
          onClick={() => setOpen((prev) => !prev)}
        >
          {label}
          {required && <span className="text-error-primary"> *</span>}
        </label>
      )}

      <div
        className={cn(
          "flex flex-col gap-1.5",
          hideDetails ? (dense ? "min-h-[28px]" : "min-h-[36px]") : dense ? "min-h-[50px]" : "min-h-[58px]"
        )}
      >
        <SelectRoot open={open} onOpenChange={setOpen} value={value} onValueChange={onValueChange}>
          <SelectTrigger
            open={open}
            disabled={disabled}
            style={{ width }}
            className={cn(
              !value && "text-foreground-secondary",
              (readOnly || disabled) && "pointer-events-none",
              hasError ? "border-error-primary focus:ring-error-primary" : "focus:border-primary focus:ring-primary"
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent style={{ width }}>
            {hasSearch && (
              <div
                className="flex items-center gap-2 border-b border-dashed px-3 py-2"
                onClick={() => inputRef.current?.focus()}
              >
                <Icon name={searchIcon} />

                <input
                  ref={inputRef}
                  value={searchValue}
                  placeholder="Search"
                  autoFocus
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="font h-6 w-full text-sm font-normal leading-[24px] text-foreground-primary outline-none focus:border-none focus:outline-none focus:ring-0"
                />
              </div>
            )}

            {filteredItems?.length === 0 ? (
              <div className="flex justify-center px-4 py-10">
                <Typography variant="body-base" color="secondary">
                  No Data
                </Typography>
              </div>
            ) : (
              <>
                {filteredItems?.map((option, i) => (
                  <SelectItem key={i} value={String(option.id)}>
                    {option.name}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </SelectRoot>

        {errorMessage && <span className="text-xs text-error-primary">{errorMessage}</span>}
      </div>
    </div>
  );
};

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
