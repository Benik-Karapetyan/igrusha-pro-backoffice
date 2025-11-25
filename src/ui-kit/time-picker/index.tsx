import { useState } from "react";

import { clockIcon, cn } from "@utils";

import { Button } from "../button";
import { Icon } from "../icon";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { TextField } from "../text-field";
import { Typography } from "../typography";
import { Hours } from "./hours";
import { Minutes } from "./minutes";

interface TimePickerProps {
  value: string;
  errorMessage?: string;
  onChange: (value: string) => void;
}

export const TimePicker = ({ value, errorMessage, onChange }: TimePickerProps) => {
  const [open, setOpen] = useState(false);
  const [hoursType, setHoursType] = useState<"am" | "pm">(value && Number(value.split(":")[0]) >= 12 ? "pm" : "am");
  const [selectedHour, setSelectedHour] = useState(
    value && Number(value.split(":")[0]) >= 12
      ? String(Number(value.split(":")[0]) - 12).padStart(2, "0")
      : value
        ? value.split(":")[0]
        : ""
  );
  const [selectedMinute, setSelectedMinute] = useState(value ? value.split(":")[1] : "");

  const handleReset = () => {
    setSelectedHour("");
    setSelectedMinute("");
    setHoursType("am");
    setOpen(false);
    onChange("");
  };

  const handleSubmit = () => {
    if (selectedHour && selectedMinute) {
      const hour = hoursType === "am" ? selectedHour : selectedHour === "12" ? "00" : String(Number(selectedHour) + 12);
      onChange(`${hour}:${selectedMinute}:00`);
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
          <div className="w-fit p-4 pb-2">
            <div className="flex gap-1 rounded-md bg-background-surface p-1">
              <Typography
                variant="heading-5"
                color={hoursType === "am" ? "link" : "secondary"}
                className={cn(
                  "flex h-7 w-[82px] cursor-pointer items-center justify-center rounded-md",
                  hoursType === "am" ? "bg-background-subtle" : ""
                )}
                onClick={() => setHoursType("am")}
              >
                AM
              </Typography>
              <Typography
                variant="heading-5"
                color={hoursType === "pm" ? "link" : "secondary"}
                className={cn(
                  "flex h-7 w-[82px] cursor-pointer items-center justify-center rounded-md",
                  hoursType === "pm" ? "bg-background-subtle" : ""
                )}
                onClick={() => setHoursType("pm")}
              >
                PM
              </Typography>
            </div>
          </div>

          <div className="flex px-4">
            <Hours value={selectedHour} onChange={setSelectedHour} />
            <Minutes value={selectedMinute} onChange={setSelectedMinute} />
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
