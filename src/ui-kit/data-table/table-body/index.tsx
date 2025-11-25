import { ReactNode } from "react";

import { cn } from "@utils";

import type { HeaderItem, TableItem } from "..";
import { ProgressCircular } from "../../progress-circular";
import { Typography } from "../../typography";
import { TableRow } from "../table-row";

interface TableBodyProps {
  loading?: boolean;
  headers: HeaderItem[];
  items: TableItem[];
  noDataContent: ReactNode;
  bordersVariant: "solid" | "dashed";
  expandable?: boolean;
  expandContent?: ReactNode;
  expandedRow?: number;
  onExpand?: (index: number) => void;
}

export const TableBody: React.FC<TableBodyProps> = ({
  loading,
  headers,
  items,
  noDataContent,
  bordersVariant,
  expandable,
  expandContent,
  expandedRow,
  onExpand,
}) => {
  return (
    <tbody>
      {loading ? (
        <tr>
          <td
            colSpan={headers.length}
            className={cn(
              "h-[98px] border-b text-center",
              bordersVariant === "solid" ? "border-solid" : "border-dashed"
            )}
          >
            <div className="text-primary">
              <ProgressCircular indeterminate />
            </div>
          </td>
        </tr>
      ) : !items?.length ? (
        <tr>
          <td
            colSpan={headers.length}
            className={cn(
              "h-[98px] border-b text-center font-semibold",
              bordersVariant === "solid" ? "border-solid" : "border-dashed"
            )}
          >
            <div className="flex flex-col items-center gap-4 p-10">
              <img src="../../no-data.svg" alt="no-data" className="h-[90px] w-[90px] object-cover" />
              <Typography variant="body-lg" color="secondary" className="font-normal">
                No Data
              </Typography>
              {noDataContent && noDataContent}
            </div>
          </td>
        </tr>
      ) : (
        <>
          {items.map((item, i) => (
            <TableRow
              key={i}
              item={item}
              headers={headers}
              bordersVariant={bordersVariant}
              expandable={expandable}
              expanded={i === expandedRow}
              expandContent={expandContent}
              onExpand={() => onExpand?.(i)}
            />
          ))}
        </>
      )}
    </tbody>
  );
};
