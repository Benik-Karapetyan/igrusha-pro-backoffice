import { FC, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { omit } from "lodash";

interface SpotTradingPairMatchingDialogProps {
  onSuccess: () => void;
}

export const SpotTradingPairMatchingDialog: FC<SpotTradingPairMatchingDialogProps> = ({ onSuccess }) => {
  const toast = useToast();
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const selectedSpotTradingPair = useStore((s) => s.selectedSpotTradingPair);
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    try {
      setLoading(true);
      await api.patch(
        `/bo/api/markets/${selectedSpotTradingPair?.id}/${selectedSpotTradingPair?.isMatchingEnabled ? "disable-matching" : "enable-matching"}`,
        omit({ ...selectedSpotTradingPair, isMatchingEnabled: !selectedSpotTradingPair?.isMatchingEnabled }, "id")
      );
      setDialogs([]);
      toast.success(`Spot trading pair has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={dialogs.includes("spotTradingPairMatching")}
      onOpenChange={(value) => setDialogs(value ? ["spotTradingPairStatus"] : [])}
    >
      <DialogContent className="w-[400px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="w-full text-center">
            Are you sure you want to {selectedSpotTradingPair?.isMatchingEnabled ? "disable" : "enable"} matching for
            this trading pair?
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="gap-4">
          <Button variant="outline" className="w-[160px]" onClick={() => setDialogs([])}>
            Cancel
          </Button>
          <Button loading={loading} className="w-[160px]" onClick={updateStatus}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
