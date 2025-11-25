import { cn } from "@utils";

import { Typography } from "../../typography";

interface MinutesProps {
  value: string;
  onChange: (value: string) => void;
}

export const Minutes = ({ value, onChange }: MinutesProps) => {
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div className="flex flex-col gap-1">
      <Typography variant="heading-5" color="disabled" className="flex min-h-9 w-[80px] items-center justify-center">
        Minutes
      </Typography>

      <div className="flex max-h-[152px] flex-col gap-1 overflow-auto">
        {minutes.map((minute) => (
          <Typography
            key={minute}
            color={value === minute ? "inverse" : "primary"}
            className={cn(
              "flex min-h-9 w-[80px] cursor-pointer items-center justify-center rounded-md",
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
