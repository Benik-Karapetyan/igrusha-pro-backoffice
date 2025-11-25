import { FC } from "react";

import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";

interface WarningDialogProps {
  description: string;
}

export const WarningDialog: FC<WarningDialogProps> = ({ description }) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);

  return (
    <Dialog open={dialogs.includes("warning")} onOpenChange={(value) => setDialogs(value ? ["warning"] : [])}>
      <DialogContent className="w-[400px] text-center">
        <DialogHeader>
          <DialogTitle className="w-full text-center">Warning</DialogTitle>
        </DialogHeader>

        <DialogDescription>{description}</DialogDescription>

        <DialogFooter>
          <Button className="w-full" onClick={() => setDialogs([])}>
            Okay
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
