import { FC } from "react";

import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";

interface UnsavedChangesDialogProps {
  onCancel?: () => void;
  onConfirm?: () => void;
}

export const UnsavedChangesDialog: FC<UnsavedChangesDialogProps> = ({ onCancel, onConfirm }) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleCancel = () => {
    if (onCancel) onCancel();
    else {
      setDialogs(dialogs.filter((type) => type !== "unsavedChanges"));
      setDrawerType(null);
    }
  };

  const handleConfirm = () => {
    setHasUnsavedChanges(false);
    if (onConfirm) onConfirm();
    else {
      setDialogs([]);
      setDrawerType(null);
    }
  };

  return (
    <Dialog
      open={dialogs.includes("unsavedChanges")}
      onOpenChange={(value) => (value ? setDialogs([...dialogs, "unsavedChanges"]) : handleCancel())}
    >
      <DialogContent className="w-[400px] text-center">
        <DialogHeader>
          <DialogTitle className="w-full text-center">Unsaved changes detected</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-center">
          You have unsaved changes. Are you sure you want to leave without saving?
        </DialogDescription>

        <DialogFooter className="gap-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
