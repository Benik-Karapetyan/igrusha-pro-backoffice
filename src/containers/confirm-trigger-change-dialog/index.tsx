import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";

interface ConfirmTriggerChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onConfirm: () => void;
}

export const ConfirmTriggerChangeDialog = ({
  open,
  onOpenChange,
  loading,
  onConfirm,
}: ConfirmTriggerChangeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Confirm Trigger Change</DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="flex flex-col gap-4">
            <p>
              This change will immediately qualify all pending referrals who have completed the removed milestone(s).
              This may result in users becoming qualified referrals instantly.
            </p>

            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>This change takes effect immediately and cannot be reversed automatically.</li>
              <li>Already qualified referrals remain unaffected.</li>
              <li>New referrals after this change will only need to complete the remaining active milestones.</li>
            </ul>
          </div>
        </DialogDescription>

        <DialogFooter className="gap-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="w-[82px]" loading={loading} onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
