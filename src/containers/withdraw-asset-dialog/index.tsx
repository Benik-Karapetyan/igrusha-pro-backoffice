import { FC } from "react";

import { WithdrawAssetForm } from "@forms";
import { mdiClose } from "@mdi/js";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Icon } from "@ui-kit";

interface WithdrawAssetDialogProps {
  onSuccess: () => void;
}

export const WithdrawAssetDialog: FC<WithdrawAssetDialogProps> = ({ onSuccess }) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);

  const handleOpenChange = (value: boolean) => {
    setDialogs(value ? ["withdrawAsset"] : []);
  };

  return (
    <Dialog open={dialogs.includes("withdrawAsset")} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[592px] min-w-[592px] text-center" aria-describedby={undefined}>
        <DialogHeader className="pb-3">
          <DialogTitle className="text-center">Withdraw</DialogTitle>

          <Button variant="ghost" size="icon" className="-mr-3" onClick={() => handleOpenChange(false)}>
            <Icon name={mdiClose} />
          </Button>
        </DialogHeader>

        <WithdrawAssetForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};
