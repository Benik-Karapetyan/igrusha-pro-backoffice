import { FC, useState } from "react";

import { BanCloseCustomerForm, SuspendCustomerForm } from "@forms";
import { useToast } from "@hooks";
import { mdiDotsVertical } from "@mdi/js";
import { api } from "@services";
import { useStore } from "@store";
import { Button, Icon, Popover, PopoverContent, PopoverTrigger } from "@ui-kit";
import { cn, getErrorMessage } from "@utils";

import { AppDrawer } from "../app-drawer";
import { ConfirmDialog } from "../confirm-dialog";
import { WarningDialog } from "../warning-dialog";
import { ActionsMenuItem } from "./components/actions-menu-item";

interface ActionsMenuProps {
  ordersCheckLoading: boolean;
  hasActiveOrders: boolean;
  onSuccess: () => void;
}

export const ActionsMenu: FC<ActionsMenuProps> = ({ ordersCheckLoading, hasActiveOrders, onSuccess }) => {
  const toast = useToast();
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const customerMainInfo = useStore((s) => s.customerMainInfo);
  const customerComplianceOverview = useStore((s) => s.customerComplianceOverview);
  const setCustomerComplianceOverview = useStore((s) => s.setCustomerComplianceOverview);
  const [open, setOpen] = useState(false);
  const [suspendDrawerOpen, setSuspendDrawerOpen] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
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

  const handleTwoFactorClick = () => {
    setTwoFactorOpen(true);
  };

  const resetTwoFactor = async () => {
    try {
      setTwoFactorLoading(true);

      await api.post(`/bo/api/customers/${customerMainInfo?.identityId}/2fa/disable`);

      setTwoFactorOpen(false);
      if (customerComplianceOverview) {
        setCustomerComplianceOverview({ ...customerComplianceOverview, twoFactorEnabled: false });
      }
      toast.success("2FA Status has been updated successfully!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setTwoFactorLoading(false);
    }
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
          <ActionsMenuItem
            name="Reset 2FA"
            disabled={!customerComplianceOverview?.twoFactorEnabled}
            onClick={handleTwoFactorClick}
          />
        </PopoverContent>
      </Popover>

      <AppDrawer
        open={dialogs.includes("banCustomer") || dialogs.includes("closeCustomer")}
        onOpenChange={(value) => !value && setDialogs([])}
      >
        <BanCloseCustomerForm onSuccess={onSuccess} />
      </AppDrawer>

      <AppDrawer open={suspendDrawerOpen} onOpenChange={setSuspendDrawerOpen}>
        <SuspendCustomerForm
          onClose={() => setSuspendDrawerOpen(false)}
          onSuccess={() => {
            setSuspendDrawerOpen(false);
            onSuccess();
          }}
        />
      </AppDrawer>

      <ConfirmDialog
        open={twoFactorOpen}
        onOpenChange={setTwoFactorOpen}
        title="Reset 2FA Authentication"
        text={`You are about to reset 2FA for this account “${customerMainInfo?.fullName}”. Confirm to Save`}
        confirmBtnVariant="critical"
        loading={twoFactorLoading}
        onCancel={() => setTwoFactorOpen(false)}
        onConfirm={resetTwoFactor}
      />

      <WarningDialog description={warningText} />
    </>
  );
};
