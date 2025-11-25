import type { FC } from "react";

import { cn } from "@utils";
import { format, isAfter } from "date-fns";

type DatepickerType = "date" | "month" | "year";

interface MonthsProps {
  headerDate: Date;
  value: string | string[];
  disableFutureMonths?: boolean;
  minAllowedYear?: number;
  minAllowedMonth?: number;
  maxAllowedMonth?: number;
  maxAllowedYear?: number;
  setHeaderDate: (headerDate: Date) => void;
  setType: (type: DatepickerType) => void;
}

const Months: FC<MonthsProps> = ({
  headerDate,
  value,
  disableFutureMonths,
  minAllowedYear,
  minAllowedMonth,
  maxAllowedMonth,
  maxAllowedYear,
  setHeaderDate,
  setType,
}) => {
  const currentDate = new Date();

  const setMonthValue = (month: number) => () => {
    setHeaderDate(new Date(headerDate.getFullYear(), month, headerDate.getDate()));
    setType("date");
  };

  const isSelectedMonth = (month: number) => {
    const selectedMonthYear = format(new Date(headerDate.getFullYear(), month, 1), "yyyy-MM");
    const valueMonthYear = !Array.isArray(value) && value.substring(0, 7);

    return selectedMonthYear === valueMonthYear;
  };

  return (
    <div className="-mx-1 flex flex-wrap">
      {Array(12)
        .fill(null)
        .map((_, i) => {
          const currentDateForMonth = new Date(headerDate.getFullYear(), i, headerDate.getDate());
          const isFutureMonth = isAfter(currentDateForMonth, currentDate);

          const isBeforeMinAllowedMonth =
            minAllowedMonth && minAllowedMonth > i && minAllowedYear && minAllowedYear == headerDate.getFullYear();
          const isAfterMaxAllowedMonth =
            maxAllowedMonth && maxAllowedMonth < i && maxAllowedYear && maxAllowedYear == headerDate.getFullYear();

          const isDisabled =
            isBeforeMinAllowedMonth || (disableFutureMonths && isFutureMonth) || isAfterMaxAllowedMonth;

          return (
            <div key={i} onClick={isDisabled ? undefined : setMonthValue(i)} style={{ width: "25%" }}>
              <div
                className={cn(
                  "cursor-pointer rounded-lg p-5 text-center text-sm font-semibold hover:bg-button-primary-background/10",
                  isDisabled && "opacity-40",
                  isSelectedMonth(i) && "bg-button-primary-background text-white"
                )}
              >
                {format(new Date(headerDate.getFullYear(), i, headerDate.getDate()), "MMM")}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Months;
