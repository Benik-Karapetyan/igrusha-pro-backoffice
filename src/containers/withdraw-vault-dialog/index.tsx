import { FC } from "react";

import { WithdrawVaultForm } from "@forms";
import { mdiClose } from "@mdi/js";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Icon } from "@ui-kit";

interface WithdrawVaultDialogProps {
  onSuccess: () => void;
}

export const WithdrawVaultDialog: FC<WithdrawVaultDialogProps> = ({ onSuccess }) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);

  const handleOpenChange = (value: boolean) => {
    setDialogs(value ? ["withdrawVault"] : []);
  };

  return (
    <Dialog open={dialogs.includes("withdrawVault")} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[592px] min-w-[592px] text-center" aria-describedby={undefined}>
        <DialogHeader className="pb-3">
          <DialogTitle className="text-center">Withdraw</DialogTitle>

          <Button variant="icon" size="icon" className="-mr-3" onClick={() => handleOpenChange(false)}>
            <Icon name={mdiClose} />
          </Button>
        </DialogHeader>

        <WithdrawVaultForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};
