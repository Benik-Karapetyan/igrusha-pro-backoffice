import { useState } from "react";

import { clockIcon } from "@utils";

import { Button } from "../button";
import { Icon } from "../icon";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { TextField } from "../text-field";
import { TimeSpanHours } from "./time-span-hours";
import { TimeSpanMinutes } from "./time-span-minutes";
import { TimeSpanSeconds } from "./time-span-seconds";

interface TimeSpanPickerProps {
  value: string;
  errorMessage?: string;
  hideSeconds?: boolean;
  onChange: (value: string) => void;
}

export const TimeSpanPicker = ({ value, errorMessage, hideSeconds, onChange }: TimeSpanPickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(value ? value.split(":")[0] || "" : "");
  const [selectedMinute, setSelectedMinute] = useState(value ? value.split(":")[1] || "" : "");
  const [selectedSecond, setSelectedSecond] = useState(value ? value.split(":")[2] || "" : "");

  const handleReset = () => {
    setSelectedHour("");
    setSelectedMinute("");
    setSelectedSecond("");
    setOpen(false);
    onChange("");
  };

  const handleSubmit = () => {
    if (selectedHour && selectedMinute && (selectedHour !== "00" || selectedMinute !== "00")) {
      onChange(`${selectedHour}:${selectedMinute}:${selectedSecond || "00"}`);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full">
        <TextField
          value={value}
          placeholder="HH:MM:SS"
          readOnly
          hideDetails
          errorMessage={errorMessage}
          appendInner={<Icon name={clockIcon} color={open ? "icon-primary" : "icon-default"} />}
          onClick={() => setOpen(true)}
        />
      </PopoverTrigger>

      <PopoverContent className="max-w-[214px]">
        <div className="flex flex-col items-center">
          <div className="flex px-4">
            <TimeSpanHours value={selectedHour} hideSeconds={hideSeconds} onChange={setSelectedHour} />
            <TimeSpanMinutes value={selectedMinute} hideSeconds={hideSeconds} onChange={setSelectedMinute} />
            {!hideSeconds && <TimeSpanSeconds value={selectedSecond} onChange={setSelectedSecond} />}
          </div>
        </div>

        <div className="flex gap-4 px-4 py-3">
          <Button variant="ghost" className="w-[82px]" onClick={handleReset}>
            Reset
          </Button>
          <Button className="w-[82px]" onClick={handleSubmit}>
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
