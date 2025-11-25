import { useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";
import { getErrorMessage } from "@utils";

interface ExcludeCustomerDialogProps {
  onSuccess: () => void;
}

export const ExcludeCustomerDialog = ({ onSuccess }: ExcludeCustomerDialogProps) => {
  const toast = useToast();
  const selectedExcludeCustomerId = useStore((s) => s.selectedExcludeCustomerId);
  const setSelectedExcludeCustomerId = useStore((s) => s.setSelectedExcludeCustomerId);
  const [loading, setLoading] = useState(false);

  const handleExcludeCustomer = async () => {
    try {
      setLoading(true);

      await api.put("/bo/api/tradeContests/users/activity/", {
        customerId: selectedExcludeCustomerId,
        isActive: false,
      });

      setSelectedExcludeCustomerId(null);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!selectedExcludeCustomerId} onOpenChange={() => setSelectedExcludeCustomerId(null)}>
      <DialogContent className="w-[400px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Exclude Customer</DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="flex flex-col gap-4">
            <p>Are you sure you want to exclude this user from the contest?</p>

            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>The user will be removed from the leaderboard and ranking.</li>
              <li>They will not receive any contest rewards.</li>
              <li>The user can continue trading normally on the platform.</li>
              <li>This action affects only their contest participation.</li>
            </ul>
          </div>
        </DialogDescription>

        <DialogFooter className="gap-4">
          <Button variant="ghost" onClick={() => setSelectedExcludeCustomerId(null)}>
            Cancel
          </Button>
          <Button variant="critical" loading={loading} onClick={handleExcludeCustomer}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
