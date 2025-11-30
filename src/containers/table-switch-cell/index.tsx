import { FC } from "react";

import { useStore } from "@store";
import { Switch } from "@ui-kit";

interface TableSwitchCellProps {
  status: number;
  id: number;
  disabled?: boolean;
}

export const TableSwitchCell: FC<TableSwitchCellProps> = ({ status, id, disabled }) => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setSelectedIds = useStore((s) => s.setSelectedIds);

  const handleSwitchClick = () => {
    setSelectedIds([id]);
    setDialogs(["status"]);
  };

  return <Switch checked={status === 1} disabled={disabled || status === 3} onClick={handleSwitchClick} />;
};
