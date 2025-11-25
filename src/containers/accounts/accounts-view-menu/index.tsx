import { FC, useMemo, useState } from "react";

import { mdiChevronDown } from "@mdi/js";
import { TAccount } from "@types";
import { Button, Icon, Popover, PopoverContent, PopoverTrigger, TextField } from "@ui-kit";
import { cn, searchIcon } from "@utils";

import { AccountsViewMenuItem } from "./accounts-view-menu-item";

interface AccountsViewMenuProps {
  items: TAccount[];
  hiddenItems: number[];
  onItemClick: (index: number) => void;
}

export const AccountsViewMenu: FC<AccountsViewMenuProps> = ({ items, hiddenItems, onItemClick }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filteredItems = useMemo(
    () => items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [search, items]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="text">
          Accounts View
          <Icon name={mdiChevronDown} color="current" className={cn(open && "rotate-180")} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="max-w-[210px]" align="end">
        <div className="flex h-10 items-center border-b border-dashed border-stroke-medium px-3">
          <TextField
            value={search}
            placeholder="Search"
            dense
            hideDetails
            prependInner={<Icon name={searchIcon} className="mr-2" />}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredItems.map((account, i) => (
          <AccountsViewMenuItem
            key={i}
            name={account.name}
            visible={!hiddenItems.includes(i)}
            onClick={() => onItemClick(i)}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
};
