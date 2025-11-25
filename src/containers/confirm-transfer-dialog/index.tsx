import { FC, useMemo, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { TAccount } from "@types";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Typography } from "@ui-kit";
import { formatAmount, getErrorMessage } from "@utils";
import { omit } from "lodash";

interface ConfirmTransferDialogDialogProps {
  accounts: TAccount[];
  onSuccess: () => void;
}

export const ConfirmTransferDialog: FC<ConfirmTransferDialogDialogProps> = ({ accounts, onSuccess }) => {
  const toast = useToast();
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const assetTransfer = useStore((s) => s.assetTransfer);
  const [loading, setLoading] = useState(false);
  const quoteAssetRatio = useMemo(
    () =>
      assetTransfer.totalBalance.quote.amount && assetTransfer.totalBalance.base.amount
        ? assetTransfer.totalBalance.quote.amount / assetTransfer.totalBalance.base.amount
        : 0,
    [assetTransfer.totalBalance.quote.amount, assetTransfer.totalBalance.base.amount]
  );
  const accountFromName = useMemo(
    () => accounts.find((account) => account.type === assetTransfer.from.type)?.name,
    [accounts, assetTransfer.from.type]
  );
  const accountToName = useMemo(
    () => accounts.find((account) => account.type === assetTransfer.to.type)?.name,
    [accounts, assetTransfer.to.type]
  );

  const transferAsset = async () => {
    try {
      setLoading(true);
      await api.post(`/fin/api/balances`, omit(assetTransfer, "totalBalance"));

      setDialogs([]);
      toast.success(`Amount successfully transfered`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={dialogs.includes("confirmTransfer")}
      onOpenChange={(value) => setDialogs(value ? ["confirmTransfer"] : [])}
    >
      <DialogContent className="w-[405px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Trasfer Confirmation</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-6 pt-3">
          <Typography variant="body-base">Are you sure you want to save the minimum payout threshold?</Typography>

          <div className="flex gap-2">
            <Typography variant="body-base" color="secondary">
              Amount to be Transferred:
            </Typography>

            <div className="flex grow flex-col items-end gap-1">
              <Typography variant="heading-4">
                {formatAmount(assetTransfer.amount as number)} {assetTransfer.totalBalance.base.currency}
              </Typography>
              {assetTransfer.totalBalance.quote && (
                <Typography variant="body-sm">
                  {formatAmount((assetTransfer.amount as number) * quoteAssetRatio)}{" "}
                  {assetTransfer.totalBalance.quote.currency}
                </Typography>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Typography variant="body-base" color="secondary">
              Account From:
            </Typography>
            <Typography variant="heading-4">{accountFromName}</Typography>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Typography variant="body-base" color="secondary">
              Account To:
            </Typography>
            <Typography variant="heading-4">{accountToName}</Typography>
          </div>
        </div>

        <DialogFooter className="gap-4">
          <Button variant="ghost" className="w-[80px]" onClick={() => setDialogs([])}>
            Cancel
          </Button>
          <Button className="w-[80px]" loading={loading} onClick={transferAsset}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
