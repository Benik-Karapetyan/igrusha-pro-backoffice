import { FC, MouseEventHandler } from "react";

import { mdiMagnify } from "@mdi/js";
import { Button, Icon, TextField } from "@ui-kit";

interface AppToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showCancelBtn?: boolean;
  onCancelClick?: MouseEventHandler<HTMLButtonElement>;
  showDisableBtn?: boolean;
  onDisableClick?: MouseEventHandler<HTMLButtonElement>;
  showBlockBtn?: boolean;
  onBlockClick?: MouseEventHandler<HTMLButtonElement>;
  showUnblockBtn?: boolean;
  onUnblockClick?: MouseEventHandler<HTMLButtonElement>;
  hasCreatePermission?: boolean;
  btnText?: string;
  onAddClick?: MouseEventHandler<HTMLButtonElement>;
}

export const AppToolbar: FC<AppToolbarProps> = ({
  searchValue,
  onSearchChange,
  showCancelBtn,
  onCancelClick,
  showDisableBtn,
  onDisableClick,
  showBlockBtn,
  onBlockClick,
  showUnblockBtn,
  onUnblockClick,
  hasCreatePermission,
  btnText,
  onAddClick,
}) => {
  return (
    <div className="flex justify-between border-b px-5 py-4">
      <TextField
        value={searchValue}
        placeholder="Search"
        className="w-[222px]"
        hideDetails
        prependInner={<Icon name={mdiMagnify} className="mr-2" />}
        onChange={(e) => onSearchChange?.(e.target.value)}
      />

      <div className="flex gap-5">
        {showCancelBtn && (
          <Button variant="outline" className="w-[140px]" onClick={onCancelClick}>
            Cancel Orders
          </Button>
        )}

        {showDisableBtn && (
          <Button variant="critical" className="w-[140px]" onClick={onDisableClick}>
            Disable
          </Button>
        )}

        {showBlockBtn && (
          <Button variant="critical" className="w-[140px]" onClick={onBlockClick}>
            Block
          </Button>
        )}

        {showUnblockBtn && (
          <Button className="w-[140px]" onClick={onUnblockClick}>
            Unblock
          </Button>
        )}

        {hasCreatePermission && <Button onClick={onAddClick}>{btnText}</Button>}
      </div>
    </div>
  );
};
