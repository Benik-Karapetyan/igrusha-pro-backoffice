import { useMemo, useRef, useState } from "react";

import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiMinusBox } from "@mdi/js";
import { ISelectItem } from "@types";
import { Icon, Typography } from "@ui-kit";
import { searchIcon } from "@utils";

import { DropdownListItem } from "../dropdown-list-item";

interface DropDownListProps<T extends string | number> {
  selectedItems?: T[];
  items?: ISelectItem[];
  showDescriptions?: boolean;
  hasSearch?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectedItemsChange: (selectedItems: T[]) => void;
}

export const DropdownList = <T extends string | number>({
  items = [],
  selectedItems,
  hasSearch = true,
  onSelectedItemsChange,
}: DropDownListProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState("");
  const filteredItems = useMemo(
    () =>
      searchValue
        ? items.filter((item) => (item.name as string).toLowerCase().includes(searchValue.toLowerCase()))
        : items,
    [searchValue, items]
  );

  const handleSelectAllClick = () => {
    if (selectedItems?.length) {
      onSelectedItemsChange([]);
    } else {
      onSelectedItemsChange(items.map((item) => item.id) as T[]);
    }
  };

  const handleClick = (id: T) => {
    if (selectedItems) {
      if (selectedItems.includes(id)) {
        onSelectedItemsChange(selectedItems.filter((item) => item !== id));
      } else {
        onSelectedItemsChange([...selectedItems, id]);
      }
    }
  };

  return (
    <div className="flex flex-col rounded-md border border-stroke-medium py-1 shadow-[0px_2px_4px_0px_#0E121B10]">
      {hasSearch && (
        <div
          className="flex items-center gap-2 border-b border-dashed px-3 py-2"
          onClick={() => inputRef.current?.focus()}
        >
          <Icon name={searchIcon} />

          <input
            ref={inputRef}
            value={searchValue}
            placeholder="Search"
            onChange={(e) => setSearchValue(e.target.value)}
            className="font h-6 w-full text-sm font-normal leading-[24px] text-foreground-primary outline-none focus:border-none focus:outline-none focus:ring-0"
          />
        </div>
      )}

      <div className="flex max-h-[300px] flex-col gap-2 overflow-auto">
        {filteredItems.length === 0 ? (
          <div className="flex justify-center px-4 py-10">
            <Typography variant="body-base" color="secondary">
              No Data
            </Typography>
          </div>
        ) : (
          <>
            <DropdownListItem
              name="Select All"
              icon={
                selectedItems?.length
                  ? selectedItems.length === items.length
                    ? mdiCheckboxMarked
                    : mdiMinusBox
                  : mdiCheckboxBlankOutline
              }
              isActive={selectedItems?.length === items.length}
              onClick={handleSelectAllClick}
            />

            {filteredItems.map((item, i) => (
              <DropdownListItem
                key={i}
                name={String(item.name)}
                icon={selectedItems?.includes(item.id as T) ? mdiCheckboxMarked : mdiCheckboxBlankOutline}
                isActive={selectedItems?.includes(item.id as T)}
                onClick={() => handleClick(item.id as T)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
