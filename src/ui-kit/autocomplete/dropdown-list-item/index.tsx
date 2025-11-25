import { Icon } from "../../icon";
import { Typography } from "../../typography";

interface DropdownListItemProps<T extends string | number> {
  name: T;
  icon: string;
  isActive?: boolean;
  onClick: () => void;
}

export const DropdownListItem = <T extends string | number>({
  name,
  icon,
  isActive,
  onClick,
}: DropdownListItemProps<T>) => {
  return (
    <div
      className="flex h-9 cursor-pointer select-none items-center justify-start gap-2 px-3 py-2 hover:bg-background-default"
      onClick={onClick}
    >
      <Icon name={icon} className={isActive ? "text-icon-primary" : "text-stroke-medium"} />

      <Typography variant={isActive ? "heading-4" : "body-base"} color={isActive ? "link" : "primary"}>
        {name}
      </Typography>
    </div>
  );
};
