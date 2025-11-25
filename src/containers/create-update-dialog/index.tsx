import { FC, PropsWithChildren } from "react";

import { mdiClose } from "@mdi/js";
import { DialogTypes, useStore } from "@store";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Icon } from "@ui-kit";

interface CreateUpdateDialogProps {
  dialogType: DialogTypes;
  title: string;
}

export const CreateUpdateDialog: FC<PropsWithChildren<CreateUpdateDialogProps>> = ({ dialogType, title, children }) => {
  const dialogs = useStore((s) => s.dialogs);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const width =
    dialogType === "product" || dialogType === "network" || dialogType === "orgLevel" || dialogType === "brand"
      ? 400
      : dialogType === "marketCategory"
        ? 480
        : 592;

  const handleOpenChange = (value: boolean) => {
    if (value) {
      setDialogs([dialogType]);
    } else {
      if (hasUnsavedChanges) setDialogs([...dialogs, "unsavedChanges"]);
      else setDialogs([]);
    }
  };

  return (
    <Dialog open={dialogs.includes(dialogType)} onOpenChange={handleOpenChange}>
      <DialogContent style={{ minWidth: width, width }} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{dialogMode === "create" ? `Add ${title}` : `Update ${title}`}</DialogTitle>

          <Button variant="ghost" size="icon" className="-mr-3" onClick={() => handleOpenChange(false)}>
            <Icon name={mdiClose} />
          </Button>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};
