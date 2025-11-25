import { FC, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { IAlertRule } from "@types";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Typography } from "@ui-kit";
import { getErrorMessage } from "@utils";

interface AlertRuleStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRule: IAlertRule | null;
  onSuccess: () => void;
}

export const AlertRuleStatusDialog: FC<AlertRuleStatusDialogProps> = ({
  open,
  onOpenChange,
  selectedRule,
  onSuccess,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const title = selectedRule?.enabled ? "Disable Rule" : "Enable Rule";
  const description = selectedRule?.enabled
    ? "This will disable the rule, and it will no longer trigger alerts for matching transactions. Please confirm, as this may reduce your monitoring coverage."
    : "This will enable the rule and begin evaluating transactions by its logic. Ensure all conditions are correctly configured before proceeding.";

  const updateRuleStatus = async () => {
    try {
      setLoading(true);

      await api.patch(`/rules/api/rules/${selectedRule?.id}/enabled`, {
        enabled: !selectedRule?.enabled,
      });

      toast.success(`Rule has been ${selectedRule?.enabled ? "disabled" : "enabled"} successfully!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[405px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-6 pt-3">
          <Typography>{description}</Typography>
        </div>

        <DialogFooter className="gap-4">
          <Button variant="ghost" className="w-[80px]" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={selectedRule?.enabled ? "critical" : "default"}
            className="w-[80px]"
            loading={loading}
            onClick={updateRuleStatus}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
