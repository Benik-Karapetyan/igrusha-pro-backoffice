import { FC, MouseEventHandler, PropsWithChildren } from "react";

import { DrawerDirection, DrawerSize } from "@types";
import { Drawer, DrawerContent } from "@ui-kit";

export interface AppDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: DrawerSize;
  direction?: DrawerDirection;
  onSubmit?: MouseEventHandler<HTMLButtonElement>;
}

export const AppDrawer: FC<PropsWithChildren<AppDrawerProps>> = ({ open, onOpenChange, size, direction, children }) => {
  return (
    <Drawer open={open} activeSnapPoint={10} onOpenChange={onOpenChange}>
      <DrawerContent direction={direction} size={size} aria-describedby={undefined}>
        {children}
      </DrawerContent>
    </Drawer>
  );
};
