import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";

interface ContestRankingExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContestRankingExplanationDialog = ({ open, onOpenChange }: ContestRankingExplanationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>How Reward Ranks Work</DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="flex flex-col gap-4">
            <p>
              Define reward tiers by specifying the <b>highest rank</b> in each tier. The system automatically assigns
              ranks based on your entries:
            </p>
            <p>
              <b>Examples:</b>
            </p>

            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>
                Row 1: Max Rank = <b>1</b> → Only 1st place gets this reward
              </li>
              <li>
                Row 2: Max Rank = <b>5</b> → Ranks 2-5 get this reward
              </li>
              <li>
                Row 3: Max Rank = <b>10</b> → Ranks 6-10 get this reward
              </li>
            </ul>

            <p>Each new row covers all ranks from the previous max rank + 1 up to the new max rank you specify.</p>

            <p>
              <b>Tips:</b>
            </p>

            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>Rows must be in ascending order</li>
              <li>Each max rank must be higher than the previous</li>
              <li>All ranks between tiers are automatically included</li>
            </ul>
          </div>
        </DialogDescription>

        <DialogFooter className="gap-4">
          <Button className="w-[82px]" onClick={() => onOpenChange(false)}>
            Ok
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
