import { useEffect } from "react";

import { mdiChevronLeft, mdiChevronRight, mdiMinus, mdiPageFirst, mdiPageLast } from "@mdi/js";

import { Icon } from "../../icon";
import { Select } from "../../select";

const itemsPerPageOptions = [
  { name: "5", id: 5 },
  { name: "10", id: 10 },
  { name: "50", id: 50 },
  { name: "100", id: 100 },
];

interface TableFooterProps {
  headersLength: number;
  itemsTotalCount?: string | number;
  itemsPerPage?: string | number;
  onItemsPerPageChange?: (val: string | number) => void;
  page?: number;
  onPageChange?: (val: number) => void;
  pageCount?: number;
}

export const TableFooter: React.FC<TableFooterProps> = ({
  headersLength,
  itemsTotalCount,
  itemsPerPage = 10,
  onItemsPerPageChange,
  page = 1,
  onPageChange,
  pageCount,
}) => {
  const handlePrevClick = () => {
    onPageChange?.(page - 1);
  };

  const handleNextClick = () => {
    onPageChange?.(page + 1);
  };

  const handleFirstPageClick = () => {
    onPageChange?.(1);
  };

  const handleLastPageClick = () => {
    if (pageCount) onPageChange?.(pageCount);
  };

  useEffect(() => {
    if (pageCount && page > pageCount) onPageChange?.(1);
  }, [page, pageCount, onPageChange]);

  return (
    <tfoot>
      <tr>
        <td colSpan={headersLength} className="h-[72px]">
          <div className="sticky right-20 flex items-center justify-end gap-x-4 px-1 sm:gap-x-6 md:px-5">
            <div className="flex gap-1">
              <span className="font-semibold">{itemsTotalCount} results.</span>
              <span className="hidden sm:inline">Results per page:</span>
            </div>
            <Select
              value={String(itemsPerPage)}
              items={itemsPerPageOptions}
              width={104}
              hideDetails
              onValueChange={onItemsPerPageChange}
            />
            <div className="-ml-2 flex items-center gap-x-4">
              <div className="flex">
                <button type="button" disabled={page < 2} onClick={handleFirstPageClick}>
                  <Icon name={mdiPageFirst} />
                </button>
                <button type="button" disabled={page < 2} onClick={handlePrevClick}>
                  <Icon name={mdiChevronLeft} />
                </button>
              </div>

              <div className="text-gray-500">
                {page} of {pageCount ? pageCount : <Icon name={mdiMinus} dense />}
              </div>

              <div className="flex">
                <button type="button" disabled={!pageCount || page === pageCount} onClick={handleNextClick}>
                  <Icon name={mdiChevronRight} />
                </button>
                <button type="button" disabled={!pageCount || page === pageCount} onClick={handleLastPageClick}>
                  <Icon name={mdiPageLast} />
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  );
};
