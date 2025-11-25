import { useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";
import { getErrorMessage } from "@utils";

interface DistributeRewardsDialogProps {
  onSuccess: () => void;
}

export const DistributeRewardsDialog = ({ onSuccess }: DistributeRewardsDialogProps) => {
  const toast = useToast();
  const selectedDistributeRewardsId = useStore((s) => s.selectedDistributeRewardsId);
  const setSelectedDistributeRewardsId = useStore((s) => s.setSelectedDistributeRewardsId);
  const [loading, setLoading] = useState(false);

  const handleDistributeRewards = async () => {
    try {
      setLoading(true);

      await api.post(`/bo/api/tradeContests/distribute/${selectedDistributeRewardsId}/`);

      setSelectedDistributeRewardsId(null);
      toast.success("Rewards distributed successfully");
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!selectedDistributeRewardsId} onOpenChange={() => setSelectedDistributeRewardsId(null)}>
      <DialogContent className="w-[400px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Distribute Rewards</DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="flex flex-col gap-4">
            <p>Are you sure you want to distribute contest rewards?</p>

            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>Rewards will be automatically sent to winners' wallets.</li>
              <li>This action cannot be undone once confirmed.</li>
              <li>Contest status will change to "Distributed".</li>
              <li>All eligible participants will receive their assigned rewards.</li>
            </ul>
          </div>
        </DialogDescription>

        <DialogFooter className="gap-4">
          <Button variant="ghost" onClick={() => setSelectedDistributeRewardsId(null)}>
            Cancel
          </Button>
          <Button loading={loading} onClick={handleDistributeRewards}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
