import { cn } from "@utils";

import { Typography } from "../../typography";

interface TimeSpanSecondsProps {
  value: string;
  onChange: (value: string) => void;
}

export const TimeSpanSeconds = ({ value, onChange }: TimeSpanSecondsProps) => {
  const seconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div className="flex flex-col gap-1">
      <Typography variant="heading-5" color="disabled" className="flex min-h-9 w-[60px] items-center justify-center">
        Seconds
      </Typography>

      <div className="flex max-h-[152px] flex-col gap-1 overflow-auto">
        {seconds.map((second) => (
          <Typography
            key={second}
            color={value === second ? "inverse" : "primary"}
            className={cn(
              "flex min-h-9 w-[60px] cursor-pointer items-center justify-center rounded-md",
              value === second ? "bg-primary" : "hover:bg-background-surface"
            )}
            onClick={() => onChange(second)}
          >
            {second}
          </Typography>
        ))}
      </div>
    </div>
  );
};
