import { FC, PropsWithChildren } from "react";

import { mdiClose } from "@mdi/js";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Icon } from "@ui-kit";

interface CreateUpdateDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  dialogWidth?: number;
}

export const CreateUpdateDialog: FC<PropsWithChildren<CreateUpdateDialogProps>> = ({
  open,
  onOpenChange,
  title,
  dialogWidth,
  children,
}) => {
  const dialogs = useStore((s) => s.dialogs);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const width = dialogWidth ? dialogWidth : 400;

  const handleOpenChange = (value: boolean) => {
    if (value) {
      onOpenChange(value);
    } else {
      if (hasUnsavedChanges) setDialogs([...dialogs, "unsavedChanges"]);
      else onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent style={{ minWidth: width, width }} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{dialogMode === "create" ? `Add ${title}` : `Update ${title}`}</DialogTitle>

          <Button variant="ghost" size="iconSmall" className="-mr-3" onClick={() => handleOpenChange(false)}>
            <Icon name={mdiClose} dense />
          </Button>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};
