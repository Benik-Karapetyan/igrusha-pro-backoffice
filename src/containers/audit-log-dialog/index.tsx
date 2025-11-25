import { FC, useEffect, useState } from "react";

import { AuditLogForm, AuditLogFormValues } from "@forms";
import { mdiClose } from "@mdi/js";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Icon } from "@ui-kit";

import { IAuditLog } from "../../pages/customer-profile/modules/audit-log/audit-log.types";

export type AuditLogDialogMode = "reason" | "jiraLink" | "comment" | "";

interface AuditLogDialogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: AuditLogDialogMode;
  title: string;
  text: string;
  selectedAuditLog: IAuditLog | null;
  formValues: AuditLogFormValues;
  onSuccess: () => void;
}

export const AuditLogDialog: FC<AuditLogDialogDialogProps> = ({
  open,
  onOpenChange,
  mode,
  title,
  text,
  selectedAuditLog,
  formValues,
  onSuccess,
}) => {
  const setDialogs = useStore((s) => s.setDialogs);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else onOpenChange(open);
  };

  useEffect(() => {
    if (!open) setHasUnsavedChanges(false);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-[615px] gap-8 px-20 py-10 text-center" aria-describedby={undefined}>
        <DialogHeader className="pb-4">
          <div className="flex w-full flex-col gap-1">
            <DialogTitle className="text-[22px]">{title}</DialogTitle>

            <div className="text-sm text-foreground-muted-more">{text}</div>
          </div>

          <Button
            variant="icon"
            size="icon"
            className="absolute right-[22px] top-6 border"
            onClick={() => handleOpenChange(false)}
          >
            <Icon name={mdiClose} />
          </Button>
        </DialogHeader>

        <AuditLogForm
          selectedAuditLog={selectedAuditLog}
          defaultValues={formValues}
          mode={mode}
          setHasUnsavedChanges={setHasUnsavedChanges}
          onClose={() => handleOpenChange(false)}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};
