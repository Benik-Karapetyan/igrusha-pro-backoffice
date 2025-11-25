import { cn } from "@utils";

import { Typography } from "../../typography";

interface TimeSpanMinutesProps {
  value: string;
  hideSeconds?: boolean;
  onChange: (value: string) => void;
}

export const TimeSpanMinutes = ({ value, hideSeconds, onChange }: TimeSpanMinutesProps) => {
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div className="flex flex-col gap-1">
      <Typography
        variant="heading-5"
        color="disabled"
        className={cn("flex min-h-9 items-center justify-center", hideSeconds ? "w-[80px]" : "w-[60px]")}
      >
        Minutes
      </Typography>

      <div className="flex max-h-[152px] flex-col gap-1 overflow-auto">
        {minutes.map((minute) => (
          <Typography
            key={minute}
            color={value === minute ? "inverse" : "primary"}
            className={cn(
              "flex min-h-9 cursor-pointer items-center justify-center rounded-md",
              hideSeconds ? "w-[80px]" : "w-[60px]",
              value === minute ? "bg-primary" : "hover:bg-background-surface"
            )}
            onClick={() => onChange(minute)}
          >
            {minute}
          </Typography>
        ))}
      </div>
    </div>
  );
};
