import { FC } from "react";

import { cn } from "@utils";

interface TableStatusCellProps {
  status: number;
}

export const TableStatusCell: FC<TableStatusCellProps> = ({ status }) => {
  return (
    <div className={cn(status === 1 ? "text-success" : "text-error")}>
      {status === 1
        ? "Active"
        : status === 2
          ? "Inactive"
          : status === 3
            ? "Deleted"
            : status === 4
              ? "Deactivated"
              : status === 5
                ? "Blocked"
                : status === 6
                  ? "Permanently Deactivated"
                  : "Closed"}
    </div>
  );
};
