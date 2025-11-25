import { useMemo, useRef, useState } from "react";

import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import clsx from "clsx";
import { addMonths, addYears, format, isAfter, subMonths, subYears } from "date-fns";
import { capitalize } from "lodash";

import { Button } from "../button";
import { Icon } from "../icon";
import Days from "./components/days";
import Months from "./components/months";

export type CalendarMode = "single" | "range";
type CalendarType = "date" | "month" | "year";

interface CalendarProps {
  mode?: CalendarMode;
  value: string | string[];
  label?: string;
  hideLabel?: boolean;
  disableFutureDates?: boolean;
  min?: string;
  max?: string;
  loadHeaderDate?: Date;
  error?: boolean;
  errorMessage?: string;
  className?: string;
  onChange: (value: string | string[]) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  mode = "single",
  value,
  label,
  hideLabel,
  disableFutureDates = false,
  min,
  max,
  loadHeaderDate,
  error,
  errorMessage,
  className,
  onChange,
}) => {
  const decrementButtonRef = useRef<HTMLButtonElement>(null);
  const [type, setType] = useState<CalendarType>("date");
  const [headerDate, setHeaderDate] = useState(
    loadHeaderDate || (value && !Array.isArray(value) ? new Date(value) : new Date())
  );
  const minAllowedYear = useMemo(() => (min ? new Date(min).getFullYear() : undefined), [min]);
  const minAllowedMonth = useMemo(() => (min ? new Date(min).getMonth() : undefined), [min]);
  const minAllowedDay = useMemo(() => (min ? new Date(min).getDate() : undefined), [min]);
  const maxAllowedYear = useMemo(() => (max ? new Date(max).getFullYear() : undefined), [max]);
  const maxAllowedMonth = useMemo(() => (max ? new Date(max).getMonth() : undefined), [max]);
  const maxAllowedDay = useMemo(() => (max ? new Date(max).getDate() : undefined), [max]);

  const prevButtonDisabled = useMemo(() => {
    const year = headerDate.getFullYear();
    const month = headerDate.getMonth();

    const isBeforeMinYear = type === "month" && minAllowedYear && year <= minAllowedYear;
    const isBeforeMinMonth = minAllowedYear && minAllowedMonth && year <= minAllowedYear && month <= minAllowedMonth;

    return isBeforeMinYear || isBeforeMinMonth;
  }, [type, headerDate, minAllowedMonth, minAllowedYear]);

  const nextButtonDisabled = useMemo(() => {
    const year = headerDate.getFullYear();
    const month = headerDate.getMonth();

    const isAfterMaxYear = type === "month" && maxAllowedYear && year >= maxAllowedYear;
    const isAfterMaxMonth = maxAllowedYear && maxAllowedMonth && year >= maxAllowedYear && month >= maxAllowedMonth;

    return isAfterMaxYear || isAfterMaxMonth;
  }, [type, headerDate, maxAllowedMonth, maxAllowedYear]);

  const hasError = error || errorMessage;

  const decrement = () => {
    switch (type) {
      case "date":
        setHeaderDate((prev) => subMonths(prev, 1));
        break;
      case "month":
        setHeaderDate((prev) => subYears(prev, 1));
        break;
      case "year":
        setHeaderDate((prev) => subMonths(prev, 1));
        break;
    }
  };

  const increment = () => {
    switch (type) {
      case "date":
        setHeaderDate((prev) => addMonths(prev, 1));
        break;
      case "month":
        setHeaderDate((prev) => addYears(prev, 1));
        break;
      case "year":
        setHeaderDate((prev) => subMonths(prev, 1));
        break;
    }
  };

  const handleDayClick = (day: number) => {
    const date = format(new Date(headerDate.getFullYear(), headerDate.getMonth(), day), "yyyy-MM-dd");

    if (mode === "single") {
      onChange(date);
    } else {
      if (Array.isArray(value)) {
        if (!value.length) {
          onChange([date]);
        } else if (value.length === 1) {
          if (isAfter(date, value[0])) {
            onChange([value[0], date]);
          } else {
            onChange([date, value[0]]);
          }
        } else {
          onChange([date]);
        }
      }
    }
  };

  const handleLastDayTabPress = () => {
    increment();
    setTimeout(() => {
      decrementButtonRef.current?.focus();
    }, 0);
  };

  const showMonthPicker = () => setType("month");

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          className,
          "flex w-[283px] flex-col gap-4 rounded-lg bg-white px-4 py-6",
          hasError && "border border-error"
        )}
      >
        {!hideLabel && label && (
          <label className="text-secondary block text-center text-sm font-semibold">{label}</label>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Button
              ref={decrementButtonRef}
              variant="icon"
              size="icon"
              disabled={!!prevButtonDisabled}
              className={prevButtonDisabled ? "opacity-40" : ""}
              onClick={decrement}
            >
              <Icon name={mdiChevronLeft} color="current" />
            </Button>

            <div
              className={clsx(
                "text-light-blue flex text-sm font-semibold",
                "gap-x-2 transition-all duration-300",
                type === "date" && "cursor-pointer hover:text-primary"
              )}
              onClick={type === "date" ? showMonthPicker : undefined}
            >
              {type === "date" && <span>{capitalize(format(headerDate, "MMMM"))}</span>}
              <span>{format(headerDate, "yyyy")}</span>
            </div>

            <Button
              variant="icon"
              size="icon"
              className={nextButtonDisabled ? "opacity-40" : ""}
              disabled={!!nextButtonDisabled}
              onClick={increment}
            >
              <Icon name={mdiChevronRight} color="current" />
            </Button>
          </div>

          {type === "date" && (
            <Days
              mode={mode}
              headerDate={headerDate}
              value={value}
              disableFutureDates={disableFutureDates}
              minAllowedYear={minAllowedYear}
              minAllowedMonth={minAllowedMonth}
              minAllowedDay={minAllowedDay}
              maxAllowedDay={maxAllowedDay}
              maxAllowedMonth={maxAllowedMonth}
              maxAllowedYear={maxAllowedYear}
              onLastDayTabPress={handleLastDayTabPress}
              onClick={handleDayClick}
            />
          )}
          {type === "month" && (
            <Months
              headerDate={headerDate}
              value={value}
              disableFutureMonths={disableFutureDates}
              minAllowedYear={minAllowedYear}
              minAllowedMonth={minAllowedMonth}
              maxAllowedMonth={maxAllowedMonth}
              maxAllowedYear={maxAllowedYear}
              setType={setType}
              setHeaderDate={setHeaderDate}
            />
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="text-xs text-error">
          <span>{errorMessage}</span>
        </div>
      )}
    </>
  );
};
