import * as React from "react";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@utils";
import { cva, VariantProps } from "class-variance-authority";

const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva("inline-flex items-center justify-center", {
  variants: {
    variant: {
      default: "",
      secondary: "rounded-md p-1 bg-background-surface gap-1",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn(tabsListVariants({ variant, className }))} {...props} />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary",
  {
    variants: {
      variant: {
        default:
          "h-14 text-sm px-3 text-foreground-primary border-b border-transparent hover:text-primary-hover data-[state=active]:border-primary",
        secondary:
          "h-7 text-xs px-2 text-foreground-secondary rounded-md hover:text-primary-hover data-[state=active]:bg-background-subtle data-[state=active]:shadow-[0px_0px_6px_0px_#0e121b29]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & VariantProps<typeof tabsTriggerVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ variant, className }))} {...props} />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
