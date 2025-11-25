import { FC } from "react";

import { mdiEye, mdiEyeOff } from "@mdi/js";
import { Icon, Typography } from "@ui-kit";

interface AccountsViewMenuItemProps {
  name: string;
  visible?: boolean;
  onClick: () => void;
}

export const AccountsViewMenuItem: FC<AccountsViewMenuItemProps> = ({ name, visible, onClick }) => {
  return (
    <div className="flex cursor-pointer items-center gap-2 px-3 text-sm text-foreground-accent" onClick={onClick}>
      <Typography variant="body-base" className="w-[152px]">
        {name}
      </Typography>
      <Icon name={visible ? mdiEyeOff : mdiEye} />
    </div>
  );
};
