import * as React from "react";

import { DrawerDirection, DrawerSize } from "@types";
import { cn } from "@utils";
import { Drawer as DrawerPrimitive } from "vaul";

const Drawer = ({ shouldScaleBackground = true, ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;
const DrawerClose = DrawerPrimitive.Close;

const DrawerContentStyle: Record<"left" | "right", string> = {
  left: "rounded-br-[12px] rounded-tr-[12px] !animate-drawer-from-left",
  right: "rounded-tl-[12px] rounded-bl-[12px] !left-auto !animate-drawer-from-right",
};

type DrawerContentProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & {
  direction?: DrawerDirection;
  status?: boolean;
  size?: DrawerSize;
};

const DrawerOverlay = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  ({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 flex bg-black/40", className)} {...props} />
  )
);
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

const DrawerContent = React.forwardRef<React.ElementRef<typeof DrawerPrimitive.Content>, DrawerContentProps>(
  ({ className, direction = "right", size = "md", children, status, ...props }, ref) => {
    const directionClass = DrawerContentStyle[direction];

    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
          ref={ref}
          className={cn(
            "animate animation-none fixed inset-0 z-50 my-2 flex h-[calc(100vh-16px)] w-[400px] select-text flex-col overflow-hidden bg-background-alt",
            {
              "-translate-x-[-400px]": status && direction === "left",
              "-translate-x-[400px]": status && direction === "right",
              "w-[800px]": size === "xl",
              "w-[600px]": size === "lg",
              "w-[400px]": size === "md",
              "w-[300px]": size === "sm",
            },
            className,
            directionClass
          )}
          {...props}
        >
          {children}
        </DrawerPrimitive.Content>
      </DrawerPortal>
    );
  }
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "border-border-stroke flex h-14 items-center justify-between gap-4 border-b bg-background-default px-4",
      className
    )}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex h-14 items-center justify-end gap-4 border-t px-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title ref={ref} className={cn("font-semibold tracking-tight", className)} {...props} />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description ref={ref} className={cn("text-muted-foreground text-sm", className)} {...props} />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
