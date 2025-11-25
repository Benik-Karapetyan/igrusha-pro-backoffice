import { FC } from "react";

import { format } from "date-fns";

interface TableDateCellProps {
  date: string | Date;
}

export const TableDateCell: FC<TableDateCellProps> = ({ date }) => {
  return <div className="min-w-[123px]">{format(date, "yyyy-MM-dd HH:mm")}</div>;
};
