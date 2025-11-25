import { FC } from "react";

import { RangePickerDialog } from "@containers";
import { Icon, TextField } from "@ui-kit";
import { calendarIcon, searchIcon } from "@utils";

interface ApiKeysToolbarProps {
  searchValue: string;
  dateValue: string | string[];
  isCalendarOpen: boolean;
  setCalendarOpen: (value: boolean) => void;
  onCalendarChange: (value: string | string[]) => void;
  onSearchChange: (value: string) => void;
}

export const ApiKeysToolbar: FC<ApiKeysToolbarProps> = ({
  searchValue,
  dateValue,
  isCalendarOpen,
  setCalendarOpen,
  onCalendarChange,
  onSearchChange,
}) => {
  return (
    <>
      <div className="w-[240px]">
        <TextField
          name="UserId"
          value={searchValue}
          placeholder="Search by UID"
          prependInner={<Icon name={searchIcon} className="mr-2" />}
          onChange={(e) => onSearchChange(e.target.value)}
          hideDetails
        />
      </div>

      <div className="w-[240px]">
        <TextField
          name="date"
          value={dateValue?.[1] ? `${dateValue[0]} - ${dateValue[1]}` : dateValue?.[0] || ""}
          placeholder="Creation Date"
          appendInner={<Icon name={calendarIcon} />}
          onClick={() => setCalendarOpen(true)}
          onChange={() => {}}
          hideDetails
        />

        <RangePickerDialog
          title="Created Date"
          open={isCalendarOpen}
          onOpenChange={setCalendarOpen}
          value={dateValue}
          onConfirm={(val) => {
            if (Array.isArray(val)) {
              onCalendarChange(val);
              setCalendarOpen(false);
            }
          }}
          reset
        />
      </div>
    </>
  );
};
