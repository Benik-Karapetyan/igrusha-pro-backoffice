import { FC } from "react";

import { WithdrawNodeForm } from "@forms";
import { mdiClose } from "@mdi/js";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Icon } from "@ui-kit";

interface WithdrawNodeDialogProps {
  onSuccess: () => void;
}

export const WithdrawNodeDialog: FC<WithdrawNodeDialogProps> = ({ onSuccess }) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);

  const handleOpenChange = (value: boolean) => {
    setDialogs(value ? ["withdrawNode"] : []);
  };

  return (
    <Dialog open={dialogs.includes("withdrawNode")} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[400px] text-center" aria-describedby={undefined}>
        <DialogHeader className="pb-3">
          <DialogTitle className="text-center">Withdraw</DialogTitle>

          <Button variant="icon" size="icon" className="-mr-3" onClick={() => handleOpenChange(false)}>
            <Icon name={mdiClose} />
          </Button>
        </DialogHeader>

        <WithdrawNodeForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};
