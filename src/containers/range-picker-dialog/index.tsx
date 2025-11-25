import { FC, useState } from "react";

import { Button, Calendar, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";

interface RangePickerDialogProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string | string[];
  minDate?: string;
  reset?: boolean;
  ignoreStartDate?: boolean;
  onConfirm: (value: string | string[]) => void;
}

export const RangePickerDialog: FC<RangePickerDialogProps> = ({
  title,
  open,
  onOpenChange,
  value,
  minDate,
  reset,
  ignoreStartDate,
  onConfirm,
}) => {
  const [innerValue, setInnerValue] = useState(value);

  const handleChange = (value: string[]) => {
    if (ignoreStartDate && innerValue[0]) setInnerValue([innerValue[0], value[0]]);
    else setInnerValue(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[max-content] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="w-full text-center">{title}</DialogTitle>
        </DialogHeader>

        <Calendar mode="range" min={minDate} value={innerValue} onChange={(value) => handleChange(value as string[])} />

        <DialogFooter className="gap-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {reset && (
            <Button
              variant="outline"
              onClick={() => {
                setInnerValue([]);
                onConfirm([]);
              }}
            >
              Reset
            </Button>
          )}
          <Button
            onClick={() => {
              if (innerValue.length === 2) onConfirm(innerValue);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
