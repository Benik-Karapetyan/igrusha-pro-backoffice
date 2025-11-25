import { cn } from "@utils";

import { Typography } from "../../typography";

interface HoursProps {
  value: string;
  onChange: (value: string) => void;
}

export const Hours = ({ value, onChange }: HoursProps) => {
  const hours = Array.from({ length: 12 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div className="flex flex-col gap-1">
      <Typography variant="heading-5" color="disabled" className="flex min-h-9 w-[80px] items-center justify-center">
        Hour
      </Typography>

      <div className="flex max-h-[152px] flex-col gap-1 overflow-auto">
        {hours.map((hour) => (
          <Typography
            key={hour}
            color={value === hour ? "inverse" : "primary"}
            className={cn(
              "flex min-h-9 w-[80px] cursor-pointer items-center justify-center rounded-md",
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
