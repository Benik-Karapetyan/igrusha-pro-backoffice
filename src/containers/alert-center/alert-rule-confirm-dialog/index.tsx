import { FC, useMemo } from "react";

import { ENUM_ALERT_RULE_FORM_FIELD_TYPE, IAlertRule, IAlertRuleForm } from "@types";
import { Button, Chip, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Typography } from "@ui-kit";
import { getTimeDuration } from "@utils";
import { startCase } from "lodash";

interface AlertRuleConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: IAlertRule;
  forms: IAlertRuleForm;
  loading: boolean;
  onConfirm: () => void;
}

export const AlertRuleConfirmDialog: FC<AlertRuleConfirmDialogProps> = ({
  open,
  onOpenChange,
  rule,
  forms,
  loading,
  onConfirm,
}) => {
  const oldForms = useMemo(
    () => [...Object.values(rule.conditionForm), ...Object.values(rule.resultForm)],
    [rule.conditionForm, rule.resultForm]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[405px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Confirm Changes</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 p-6 pt-3">
          <div className="flex items-center gap-1">
            <Typography>You change </Typography>
            <Typography className="font-semibold">{rule.name}:</Typography>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <Typography className="w-[38px]">From:</Typography>

              <div className="flex flex-col gap-2">
                {oldForms.map((form) => (
                  <Chip
                    key={form.label}
                    title={startCase(form.label) + ":"}
                    text={
                      form.type === ENUM_ALERT_RULE_FORM_FIELD_TYPE.TimeSpan ? getTimeDuration(form.value) : form.value
                    }
                    size="small"
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Typography className="w-[38px]">To:</Typography>

              <div className="flex flex-col gap-2">
                {Object.values(forms).map((form) => (
                  <Chip
                    key={form.label}
                    title={startCase(form.label) + ":"}
                    text={
                      form.type === ENUM_ALERT_RULE_FORM_FIELD_TYPE.TimeSpan ? getTimeDuration(form.value) : form.value
                    }
                    size="small"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-4">
          <Button variant="ghost" className="w-[80px]" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="w-[80px]" loading={loading} onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
