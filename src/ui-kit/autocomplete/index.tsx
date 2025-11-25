import { useEffect, useRef, useState } from "react";

import { ISelectItem } from "@types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@ui-kit";
import { cn } from "@utils";

import { DropdownList } from "./dropdown-list";
import { MultiSelectInput } from "./multi-select-input";

interface AutocompleteProps<T extends string | number> {
  label?: string;
  selectedItems?: T[];
  items?: ISelectItem[];
  hasSearch?: boolean;
  className?: string;
  placeholder?: string;
  errorMessage?: string;
  onChange?: (selectedItems: T[]) => void;
}

export const Autocomplete = <T extends string | number>({
  label,
  selectedItems,
  items,
  hasSearch,
  placeholder,
  className,
  errorMessage,
  onChange,
}: AutocompleteProps<T>) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number>(0);

  const handleSelectedItemsChange = (items: T[]) => onChange?.(items);

  const handleRemoveTag = (e: React.MouseEvent<HTMLDivElement>, tag?: string | number) => {
    e.stopPropagation();

    const newSelectedItems =
      tag === "remaining" ? selectedItems?.slice(0, 3) : selectedItems?.filter((tagId) => tagId !== tag);
    onChange?.(newSelectedItems || []);
  };

  const handleClick = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current?.offsetWidth);
    }
  }, []);

  return (
    <div className={cn("flex w-full flex-col bg-background-subtle", className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <MultiSelectInput
            ref={triggerRef}
            open={open}
            label={label}
            items={items}
            selectedItems={selectedItems}
            placeholder={placeholder}
            errorMessage={errorMessage}
            onTagClick={handleRemoveTag}
            onClick={handleClick}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          style={{ width: triggerWidth }}
          className="gap-1 border-none bg-background-subtle p-0 outline-none focus:border-none focus:outline-none focus:ring-0"
        >
          <DropdownList
            onOpenChange={setOpen}
            selectedItems={selectedItems}
            items={items}
            hasSearch={hasSearch}
            onSelectedItemsChange={handleSelectedItemsChange}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
