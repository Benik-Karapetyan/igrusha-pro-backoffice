import { ReactNode } from "react";

import { cn } from "@utils";

import { TableBody } from "./table-body";
import { TableFooter } from "./table-footer";
import { TableHeader } from "./table-header";

export interface HeaderItem {
  text: string | (() => React.ReactNode);
  value: string | ((val: TableItem) => React.ReactNode);
  align?: "start" | "center" | "end";
  sortable?: boolean;
  width?: string | number;
  maxWidth?: string | number;
}

export interface TableItem {
  [key: string]: string | number | boolean | TableItem | undefined;
}

interface DataTableProps {
  className?: string;
  style?: React.CSSProperties;
  headers: HeaderItem[];
  items: TableItem[];
  fixedHeader?: boolean;
  height?: string | number;
  loading?: boolean;
  noDataContent?: ReactNode;
  bordersVariant?: "solid" | "dashed";
  expandable?: boolean;
  expandContent?: ReactNode;
  expandedRow?: number;
  onExpand?: (index: number) => void;
  hideFooter?: boolean;
  itemsPerPage?: string | number;
  onItemsPerPageChange?: (val: string | number) => void;
  page?: number;
  onPageChange?: (val: number) => void;
  pageCount?: number;
  itemsTotalCount?: string | number;
}

export const DataTable: React.FC<DataTableProps> = ({
  className,
  style,
  headers,
  items,
  fixedHeader,
  height,
  loading,
  noDataContent,
  bordersVariant = "solid",
  expandable,
  expandContent,
  expandedRow,
  onExpand,
  hideFooter,
  itemsTotalCount,
  itemsPerPage,
  onItemsPerPageChange,
  page,
  onPageChange,
  pageCount,
}) => {
  return (
    <div className={cn(className, "w-full max-w-full rounded-t-xl leading-normal")}>
      <div style={{ ...style, height: height && `${height}px` }}>
        <table border={1} className={cn("text-light-blue relative w-full")}>
          <TableHeader headers={headers} fixedHeader={fixedHeader} expandable={expandable} />

          <TableBody
            headers={headers}
            items={items}
            loading={loading}
            noDataContent={noDataContent}
            bordersVariant={bordersVariant}
            expandable={expandable}
            expandContent={expandContent}
            expandedRow={expandedRow}
            onExpand={onExpand}
          />

          {!hideFooter && (
            <TableFooter
              headersLength={headers.length}
              itemsTotalCount={itemsTotalCount}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={onItemsPerPageChange}
              page={page}
              onPageChange={onPageChange}
              pageCount={pageCount}
            />
          )}
        </table>
      </div>
    </div>
  );
};
