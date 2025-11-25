import { FC } from "react";

import { mdiMagnify } from "@mdi/js";
import { ENUM_ORDER_HISTORY_SEARCH_TERM } from "@types";
import { Button, Icon, RadioGroup, RadioGroupItem, TextField } from "@ui-kit";
import { startCase } from "lodash";

interface OrderHistoryToolbarProps {
  searchTerm: ENUM_ORDER_HISTORY_SEARCH_TERM;
  onSearchTermChange: (value: ENUM_ORDER_HISTORY_SEARCH_TERM) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onRefetchClick?: () => void;
}

export const OrderHistoryToolbar: FC<OrderHistoryToolbarProps> = ({
  searchTerm,
  onSearchTermChange,
  searchValue,
  onSearchChange,
  onRefetchClick,
}) => {
  return (
    <div className="flex items-center justify-between gap-5 border-b px-5 py-4">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <div>Search By:</div>

          <RadioGroup
            defaultValue={searchTerm}
            onValueChange={(val) => onSearchTermChange(val as ENUM_ORDER_HISTORY_SEARCH_TERM)}
            className="flex flex-row"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id={ENUM_ORDER_HISTORY_SEARCH_TERM.CustomerId}
                value={ENUM_ORDER_HISTORY_SEARCH_TERM.CustomerId}
              />
              <label
                htmlFor={ENUM_ORDER_HISTORY_SEARCH_TERM.CustomerId}
                className="cursor-pointer select-none text-sm font-semibold text-foreground-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
              >
                Customer Id
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                id={ENUM_ORDER_HISTORY_SEARCH_TERM.OrderId}
                value={ENUM_ORDER_HISTORY_SEARCH_TERM.OrderId}
              />
              <label
                htmlFor={ENUM_ORDER_HISTORY_SEARCH_TERM.OrderId}
                className="cursor-pointer select-none text-sm font-semibold text-foreground-muted peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
              >
                Order Id
              </label>
            </div>
          </RadioGroup>
        </div>

        <TextField
          value={searchValue}
          placeholder={startCase(searchTerm)}
          type={searchTerm === ENUM_ORDER_HISTORY_SEARCH_TERM.OrderId ? "number" : "text"}
          hideDetails
          prependInner={<Icon name={mdiMagnify} className="mr-2" />}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <Button onClick={onRefetchClick}>Refetch</Button>
    </div>
  );
};
