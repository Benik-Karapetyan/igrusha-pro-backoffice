import { FC } from "react";

import { useStore } from "@store";
import {
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui-kit";
import { cn } from "@utils";

interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  text: string;
  confirmBtnText?: string;
  confirmBtnVariant?: ButtonProps["variant"];
  loading?: boolean;
  className?: string;
  onCancel?: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  text,
  confirmBtnText = "Confirm",
  confirmBtnVariant,
  loading,
  className,
  onCancel,
  onConfirm,
}) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);

  const handleCancel = () => {
    if (onCancel) onCancel();
    else setDialogs([]);
  };

  const handleOpenChange = (value: boolean) => {
    if (onOpenChange) onOpenChange(value);
    else setDialogs(value ? ["confirm"] : []);
  };

  return (
    <Dialog open={typeof open !== "undefined" ? open : dialogs.includes("confirm")} onOpenChange={handleOpenChange}>
      <DialogContent className={cn("w-[400px] text-center", className)}>
        <DialogHeader>
          <DialogTitle className="w-full">{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription>{text}</DialogDescription>

        <DialogFooter className="gap-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant={confirmBtnVariant} className="w-[82px]" loading={loading} onClick={onConfirm}>
            {confirmBtnText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
