import { FC } from "react";

import { cn } from "@utils";

interface ActionsMenuItemProps {
  name: string;
  disabled?: boolean;
  onClick: () => void;
}

export const ActionsMenuItem: FC<ActionsMenuItemProps> = ({ name, disabled, onClick }) => {
  return (
    <div
      className={cn(
        "px-3 py-1.5 text-sm",
        disabled ? "cursor-not-allowed text-foreground-muted-more" : "cursor-pointer text-foreground-accent"
      )}
      onClick={disabled ? undefined : onClick}
    >
      {name}
    </div>
  );
};
