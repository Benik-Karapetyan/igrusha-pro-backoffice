import { checkIcon } from "@utils";

import { Icon } from "../icon";
import { Typography } from "../typography";

interface DropdownItemProps {
  text: string;
  value: string;
  selected: boolean;
  onClick: (value: string) => void;
}

export const DropdownItem = ({ text, value, selected, onClick }: DropdownItemProps) => {
  return (
    <div
      className="flex h-9 cursor-pointer items-center gap-2 px-3 hover:bg-background-default"
      onClick={() => onClick(value)}
    >
      <Typography variant={selected ? "heading-4" : "body-base"} color={selected ? "link" : "primary"} className="grow">
        {text}
      </Typography>

      {selected && <Icon name={checkIcon} color="icon-success" />}
    </div>
  );
};
