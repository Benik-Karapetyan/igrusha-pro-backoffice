import type { FC, ReactNode } from "react";

import { mdiChevronDown, mdiChevronUp, mdiMinus } from "@mdi/js";
import { cn } from "@utils";

import { HeaderItem, TableItem } from "..";
import { Icon } from "../../icon";

const alignments = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
};

function isTableItem(item: string | number | boolean | TableItem | undefined): item is TableItem {
  return !(!item || typeof item === "string" || typeof item === "number" || typeof item === "boolean");
}

interface TableRowProps {
  item: TableItem;
  headers: HeaderItem[];
  bordersVariant: "solid" | "dashed";
  expandable?: boolean;
  expandContent?: ReactNode;
  expanded?: boolean;
  onExpand?: () => void;
}

export const TableRow: FC<TableRowProps> = ({
  item,
  headers,
  bordersVariant,
  expandable,
  expandContent,
  expanded,
  onExpand,
}) => {
  return (
    <>
      <tr
        className={cn(
          "odd:bg-background-subtle hover:bg-primary-light",
          bordersVariant === "solid" && "even:bg-background-default"
        )}
      >
        {headers.map(({ text, value, align = "start", width, maxWidth }, hi) => (
          <td
            key={hi}
            className={cn(
              "group flex h-10 items-center justify-between px-5 text-sm md:table-cell md:px-3",
              "border-b",
              "overflow-hidden text-ellipsis",
              bordersVariant === "solid" ? "border-solid" : "border-dashed",
              alignments[align]
            )}
            style={{ width, maxWidth }}
            title={typeof value === "string" && typeof item[value] === "string" ? item[value] : undefined}
          >
            <div className={cn("overflow-hidden text-ellipsis whitespace-nowrap font-semibold md:hidden")}>
              {typeof text === "function" ? <>{text()}</> : <>{text}</>}
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {typeof value === "function" ? (
                value(item)
              ) : !isTableItem(item[value]) ? (
                item[value] === 0 ? (
                  item[value]
                ) : (
                  item[value] || <Icon name={mdiMinus} dense />
                )
              ) : (
                <Icon name={mdiMinus} dense />
              )}
            </div>
          </td>
        ))}

        {expandable && (
          <td
            className={cn(
              "group flex h-10 items-center justify-between px-5 text-sm text-gray-600 md:table-cell md:px-3",
              "border-b",
              "overflow-hidden text-ellipsis",
              bordersVariant === "solid" ? "border-solid" : "border-dashed"
            )}
          >
            <Icon
              name={expanded ? mdiChevronUp : mdiChevronDown}
              color="current"
              className="cursor-pointer"
              onClick={onExpand}
            />
          </td>
        )}
      </tr>

      {expanded && (
        <tr>
          <td
            colSpan={headers.length + 1}
            className={cn(
              "group flex h-14 items-center justify-between px-5 text-sm text-gray-600 md:table-cell md:px-3",
              "border-b border-r last-of-type:border-r-0",
              "overflow-hidden text-ellipsis",
              bordersVariant === "solid" ? "border-solid" : "border-dashed"
            )}
          >
            {expandContent}
          </td>
        </tr>
      )}
    </>
  );
};
