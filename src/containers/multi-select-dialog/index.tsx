import { useEffect, useMemo, useState } from "react";

import { mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline, mdiMagnify } from "@mdi/js";
import { ISelectItem } from "@types";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Icon, TextField } from "@ui-kit";

interface MultiSelectDialogProps<T extends string | number> {
  open?: boolean;
  title: string;
  items: ISelectItem[];
  selectedItems: T[];
  showDescriptions?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (selectedItems: T[]) => void;
}

export const MultiSelectDialog = <T extends string | number>({
  open,
  title,
  items,
  selectedItems,
  showDescriptions,
  onOpenChange,
  onSubmit,
}: MultiSelectDialogProps<T>) => {
  const [searchValue, setSearchValue] = useState("");
  const [innerSelectedItems, setInnerSelectedItems] = useState(selectedItems);
  const filteredItems = useMemo(
    () =>
      searchValue
        ? items.filter((item) => (item.name as string).toLowerCase().includes(searchValue.toLowerCase()))
        : items,
    [searchValue, items]
  );

  const handleClick = (id: T) => {
    const newSelectedItems = [...innerSelectedItems];
    const index = innerSelectedItems.findIndex((c) => c === id);
    if (index === -1) newSelectedItems.push(id);
    else newSelectedItems.splice(index, 1);
    setInnerSelectedItems(newSelectedItems);
  };

  const handleSubmit = () => {
    onSubmit(innerSelectedItems);
  };

  useEffect(() => {
    setInnerSelectedItems(selectedItems);
  }, [selectedItems]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[350px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 p-6">
          <TextField
            value={searchValue}
            placeholder="Filter"
            hideDetails
            prependInner={<Icon name={mdiMagnify} className="mr-2" />}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <div className="flex max-h-[calc(100vh_-_15rem)] flex-col gap-1 overflow-auto">
            {filteredItems.map((item, i) => (
              <div
                key={i}
                className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-background"
                onClick={() => handleClick(item.id as T)}
              >
                <div>
                  <div className="select-none text-sm">{item.name}</div>
                  {showDescriptions && (
                    <div className="select-none text-sm text-foreground-muted">{item.description}</div>
                  )}
                </div>

                <Icon
                  name={innerSelectedItems.includes(item.id as T) ? mdiCheckboxMarkedOutline : mdiCheckboxBlankOutline}
                  color="icon-primary"
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="px-6">
          <Button className="w-full" onClick={handleSubmit}>
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
