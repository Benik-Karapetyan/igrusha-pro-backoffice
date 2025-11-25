import { FC, useState } from "react";

import { mdiDotsVertical } from "@mdi/js";
import { useStore } from "@store";
import { Button, Icon, Popover, PopoverContent, PopoverTrigger } from "@ui-kit";
import { cn } from "@utils";

import { AppDrawer } from "../app-drawer";
import { WarningDialog } from "../warning-dialog";
import { ActionsMenuItem } from "./components/actions-menu-item";

interface ActionsMenuProps {
  ordersCheckLoading: boolean;
  hasActiveOrders: boolean;
}

export const ActionsMenu: FC<ActionsMenuProps> = ({ ordersCheckLoading, hasActiveOrders }) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const [open, setOpen] = useState(false);
  const [suspendDrawerOpen, setSuspendDrawerOpen] = useState(false);
  const [warningText, setWarningText] = useState("");

  const handleBanClick = () => {
    if (hasActiveOrders) {
      setWarningText(
        "You cannot ban this customer because there are active orders. Please cancel all active orders first."
      );
      setDialogs(["warning"]);
    } else {
      setDialogs(["banCustomer"]);
    }
  };

  const handleCloseClick = () => {
    if (hasActiveOrders) {
      setWarningText(
        "You cannot close this customer because there are active orders. Please cancel all active orders first."
      );
      setDialogs(["warning"]);
    } else {
      setDialogs(["closeCustomer"]);
    }
  };

  const handleSuspendClick = () => {
    setSuspendDrawerOpen(true);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "ml-auto w-[100px] gap-0",
              !ordersCheckLoading && "pl-4 pr-2",
              open && "bg-primary-dark hover:bg-primary-dark"
            )}
            loading={ordersCheckLoading}
          >
            Actions
            <Icon name={mdiDotsVertical} color="current" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="max-w-[120px] p-0" align="end">
          <ActionsMenuItem name="Ban" onClick={handleBanClick} />
          <ActionsMenuItem name="Close" onClick={handleCloseClick} />
          <ActionsMenuItem name="Suspend" onClick={handleSuspendClick} />
        </PopoverContent>
      </Popover>

      <AppDrawer
        open={dialogs.includes("banCustomer") || dialogs.includes("closeCustomer")}
        onOpenChange={(value) => !value && setDialogs([])}
      ></AppDrawer>

      <AppDrawer open={suspendDrawerOpen} onOpenChange={setSuspendDrawerOpen}></AppDrawer>

      <WarningDialog description={warningText} />
    </>
  );
};
