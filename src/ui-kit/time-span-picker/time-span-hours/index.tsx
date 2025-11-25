import { cn } from "@utils";

import { Typography } from "../../typography";

interface TimeSpanHoursProps {
  value: string;
  hideSeconds?: boolean;
  onChange: (value: string) => void;
}

export const TimeSpanHours = ({ value, hideSeconds, onChange }: TimeSpanHoursProps) => {
  const hours = Array.from({ length: 25 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div className="flex flex-col gap-1">
      <Typography
        variant="heading-5"
        color="disabled"
        className={cn("flex min-h-9 items-center justify-center", hideSeconds ? "w-[80px]" : "w-[60px]")}
      >
        Hour
      </Typography>

      <div className="flex max-h-[152px] flex-col gap-1 overflow-auto">
        {hours.map((hour) => (
          <Typography
            key={hour}
            color={value === hour ? "inverse" : "primary"}
            className={cn(
              "flex min-h-9 cursor-pointer items-center justify-center rounded-md",
              hideSeconds ? "w-[80px]" : "w-[60px]",
              value === hour ? "bg-primary" : "hover:bg-background-surface"
            )}
            onClick={() => onChange(hour)}
          >
            {hour}
          </Typography>
        ))}
      </div>
    </div>
  );
};
