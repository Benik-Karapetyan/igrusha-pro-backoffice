import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";

import clsx from "clsx";
import { isToday as fnsIsToday, format, getDay, getDaysInMonth, isAfter, isBefore, isEqual } from "date-fns";

import { CalendarMode } from "../..";

interface DaysProps {
  mode: CalendarMode;
  headerDate: Date;
  value: string | string[];
  disableFutureDates?: boolean;
  minAllowedYear?: number;
  minAllowedMonth?: number;
  minAllowedDay?: number;
  maxAllowedYear?: number;
  maxAllowedMonth?: number;
  maxAllowedDay?: number;
  onLastDayTabPress: () => void;
  onClick: (day: number) => void;
}

const Days: FC<DaysProps> = ({
  headerDate,
  value,
  disableFutureDates,
  minAllowedYear,
  minAllowedMonth,
  minAllowedDay,
  maxAllowedDay,
  maxAllowedMonth,
  maxAllowedYear,
  onLastDayTabPress,
  onClick,
}) => {
  const weekDays = ["mo", "tu", "we", "th", "fr", "sa", "su"];
  const [dayCount, setDayCount] = useState<number[]>([]);
  const [blankDays, setBlankDays] = useState<number[]>([]);

  const getDayCount = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const dayOfWeek = getDay(new Date(date.getFullYear(), date.getMonth(), 0));
    const blankdaysArray = [];

    for (let i = 1; i <= dayOfWeek; i++) {
      blankdaysArray.push(i);
    }

    const daysArray = [];

    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }

    setBlankDays(blankdaysArray);
    setDayCount(daysArray);
  };

  const isDisabled = useCallback(
    (day: number) => {
      const currentDate = new Date();
      const selectedDate = new Date(headerDate.getFullYear(), headerDate.getMonth(), day);

      if (disableFutureDates && currentDate < selectedDate) {
        return true;
      }

      if (minAllowedYear && (minAllowedMonth || minAllowedMonth === 0) && minAllowedDay) {
        const minAllowedDate = new Date(minAllowedYear, minAllowedMonth, minAllowedDay);
        if (selectedDate < minAllowedDate) {
          return true;
        }
      }

      if (maxAllowedYear && (maxAllowedMonth || maxAllowedMonth === 0) && maxAllowedDay) {
        const maxAllowedDate = new Date(maxAllowedYear, maxAllowedMonth, maxAllowedDay);
        if (selectedDate > maxAllowedDate) {
          return true;
        }
      }

      return false;
    },
    [
      disableFutureDates,
      headerDate,
      minAllowedDay,
      minAllowedMonth,
      minAllowedYear,
      maxAllowedDay,
      maxAllowedMonth,
      maxAllowedYear,
    ]
  );

  const isToday = (day: number) => fnsIsToday(new Date(headerDate.getFullYear(), headerDate.getMonth()).setDate(day));

  const isSelected = (day: number) => {
    const date = format(new Date(headerDate.getFullYear(), headerDate.getMonth(), day), "yyyy-MM-dd");

    if (Array.isArray(value)) {
      if (value.length && value.length === 1) {
        return isEqual(value[0], date);
      } else if (value.length === 2) {
        return (
          isEqual(value[0], date) ||
          (isAfter(date, value[0]) && isBefore(date, value[value.length - 1])) ||
          isEqual(value[value.length - 1], date)
        );
      }
    } else {
      return date === value;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, day: number) => {
    if (e.key === "Enter") {
      handleClick(day);
    } else if (e.key === "Tab" && day === dayCount.length) {
      e.preventDefault();
      onLastDayTabPress();
    }
  };

  const handleClick = (day: number) => {
    if (!isDisabled(day)) onClick(day);
  };

  useEffect(() => {
    getDayCount(headerDate);
  }, [headerDate]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-x-1">
        {weekDays?.map((day) => (
          <div key={day} className="text-light-blue flex h-8 w-8 items-center justify-center text-sm opacity-40">
            {day}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {blankDays.map((i) => (
          <div key={i} className="h-8 w-8"></div>
        ))}

        {dayCount.map((day) => (
          <div
            key={day}
            className={clsx(
              "day-item",
              "flex h-8 w-8 select-none flex-wrap items-center justify-center rounded-full",
              "text-xs",
              isDisabled(day) ? "opacity-40" : "cursor-pointer",
              isToday(day) && "border border-primary text-primary",
              !isSelected(day) && !isDisabled(day) && "hover:bg-primary/10",
              isSelected(day) ? "bg-primary text-white" : ""
            )}
            tabIndex={isDisabled(day) ? -1 : 0}
            onKeyDown={(e) => handleKeyDown(e, day)}
            onClick={() => handleClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Days;
