import { FC } from "react";

import { Switch } from "@ui-kit";

interface TableSwitchCellProps {
  checked: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const TableSwitchCell: FC<TableSwitchCellProps> = ({ checked, disabled, onClick }) => {
  return <Switch checked={checked} disabled={disabled} onClick={onClick} />;
};
