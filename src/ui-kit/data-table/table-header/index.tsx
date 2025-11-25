import { cn } from "@utils";

import type { HeaderItem } from "..";

const alignments = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
};

interface TableHeaderProps {
  headers: HeaderItem[];
  fixedHeader?: boolean;
  expandable?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ headers, fixedHeader, expandable }) => {
  return (
    <thead className={cn("hidden md:table-header-group", fixedHeader && "sticky top-0 z-10 bg-[#FBFBFB]")}>
      <tr>
        {headers.map(({ text, align = "start", sortable = true, width, maxWidth }, i) => (
          <th
            key={i}
            role="columnheader"
            className={cn(
              "group whitespace-nowrap bg-background-surface text-sm text-foreground-secondary",
              "border-stroke h-9 border-b border-r border-stroke-divider pl-3 pr-2 font-semibold capitalize last-of-type:border-r-0",
              alignments[align],
              sortable && "pointer-events-auto outline-0"
            )}
            style={{ minWidth: width, width, maxWidth }}
          >
            <div className="flex flex-nowrap items-center" style={{ justifyContent: align }}>
              {typeof text === "function" ? <>{text()}</> : <span>{text}</span>}
            </div>
          </th>
        ))}

        {expandable && (
          <th
            className={cn(
              "group max-w-12 bg-background-muted text-sm text-foreground-secondary",
              "h-10 border-b border-r border-stroke-divider px-3 font-semibold capitalize last-of-type:border-r-0"
            )}
          ></th>
        )}
      </tr>
    </thead>
  );
};
