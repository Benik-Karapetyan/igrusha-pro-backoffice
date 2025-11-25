import { useCallback, useState } from "react";

import { api } from "@services";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Typography } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { toast } from "sonner";

interface IBlockReferralLinkDialog {
  onSuccess?: () => void;
}

export const BlockReferralLinkDialog = ({ onSuccess }: IBlockReferralLinkDialog) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const selectedReferralLink = useStore((s) => s.selectedReferralLink);
  const setSelectedReferralLink = useStore((s) => s.setSelectedReferralLink);

  const [loading, setLoading] = useState(false);

  const updateReferralUserStatus = useCallback(async () => {
    try {
      setLoading(true);

      const path = selectedReferralLink?.status !== 3 ? "block" : "unblock";

      await api.get(`/bo/api/ReferralUsers/${selectedReferralLink?.id}/${path}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
      setDialogs([]);
      setSelectedReferralLink(null);
    }
  }, [selectedReferralLink?.id, selectedReferralLink?.status, setDialogs, setSelectedReferralLink]);

  const handleConfirm = useCallback(async () => {
    await updateReferralUserStatus();
    onSuccess?.();
  }, [onSuccess, updateReferralUserStatus]);

  return (
    <Dialog
      open={dialogs.includes("blockReferralLink")}
      onOpenChange={(value) => setDialogs(value ? ["blockReferralLink"] : [])}
    >
      <DialogContent className="w-[400px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Block Referral Link</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-6 pt-3 text-left">
          <Typography>
            Are you sure you want to block this user's “
            <span className="font-semibold">{selectedReferralLink?.id}</span>” referral link?
          </Typography>

          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>
              <Typography>Other users will no longer be able to register using this referral link or code.</Typography>
            </li>
            <li>
              <Typography>
                The owner of the referral link will not receive any referral bonuses while the link is blocked.
              </Typography>
            </li>
          </ul>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setDialogs([]);
              setSelectedReferralLink(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant={selectedReferralLink?.status !== 3 ? "critical" : "default"}
            loading={loading}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
