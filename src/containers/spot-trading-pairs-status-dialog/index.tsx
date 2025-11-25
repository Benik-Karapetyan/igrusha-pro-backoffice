import { FC, useMemo } from "react";

import { SpotTradingPairStatusForm } from "@forms";
import { useStore } from "@store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui-kit";

interface SpotTradingPairStatusDialogProps {
  onSuccess: () => void;
}

export const SpotTradingPairStatusDialog: FC<SpotTradingPairStatusDialogProps> = ({ onSuccess }) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const spotTradingPairStatus = useStore((s) => s.spotTradingPairStatus);
  const enabled = useStore((s) => s.selectedElementEnabled);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);

  const dialogTitle = useMemo(
    () =>
      enabled
        ? "Are you sure you want to deactivate this trading pair"
        : spotTradingPairStatus.status === "Inactive"
          ? "Are you sure you want to activate this trading pair"
          : "Are you sure you want to change the trading mode",
    [enabled, spotTradingPairStatus.status]
  );

  const handleOpenChange = (value: boolean) => {
    if (value) {
      setDialogs(["spotTradingPairStatus"]);
    } else {
      if (hasUnsavedChanges) setDialogs([...dialogs, "unsavedChanges"]);
      else setDialogs([]);
    }
  };

  return (
    <Dialog open={dialogs.includes("spotTradingPairStatus")} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[400px] text-center" aria-describedby={undefined}>
        <DialogHeader className="pb-3">
          <DialogTitle className="w-full text-center">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <SpotTradingPairStatusForm onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
};
