import { FC } from "react";

import { mdiCash, mdiDelete, mdiKeyVariant, mdiPlayBox, mdiRocketLaunch, mdiStopCircle } from "@mdi/js";
import { Icon, TableItem } from "@ui-kit";
import { cn, editIcon, lockIcon, unLockIcon, viewIcon } from "@utils";

export type TableAction =
  | "block"
  | "watch"
  | "resetPassword"
  | "deploy"
  | "start"
  | "stop"
  | "withdraw"
  | "edit"
  | "delete";

interface TableActionsCellProps {
  className?: string;
  actions: TableAction[];
  item: TableItem;
  disabled?: TableAction[];
  onBlock?: (item: TableItem) => void;
  onWatch?: (item: TableItem) => void;
  onResetPassword?: (item: TableItem) => void;
  onDeploy?: (id: number) => void;
  onStart?: (id: number) => void;
  onStop?: (id: number) => void;
  onWithdraw?: (id: number) => void;
  onEdit?: (item: TableItem) => void;
  onDelete?: (id: number) => void;
}

export const TableActionsCell: FC<TableActionsCellProps> = ({
  className,
  actions,
  item,
  disabled,
  onBlock,
  onWatch,
  onResetPassword,
  onDeploy,
  onStart,
  onStop,
  onWithdraw,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={cn("flex gap-3", className)}>
      {actions.includes("block") && (
        <Icon
          name={item?.status !== 3 ? unLockIcon : lockIcon}
          color={item?.status !== 3 ? "icon-primary" : "icon-error"}
          className="cursor-pointer"
          disabled={disabled?.includes("block")}
          onClick={() => onBlock?.(item)}
        />
      )}

      {actions.includes("watch") && (
        <Icon
          name={viewIcon}
          color="icon-primary"
          className="cursor-pointer"
          disabled={disabled?.includes("watch")}
          onClick={() => onWatch?.(item)}
        />
      )}

      {actions.includes("resetPassword") && (
        <Icon
          name={mdiKeyVariant}
          color="icon-default"
          className="rotate-90 cursor-pointer"
          disabled={disabled?.includes("resetPassword")}
          onClick={() => onResetPassword?.(item)}
        />
      )}

      {actions.includes("deploy") && (
        <Icon
          name={mdiRocketLaunch}
          color="icon-default"
          className="cursor-pointer"
          disabled={disabled?.includes("deploy")}
          onClick={() => onDeploy?.(item.id as number)}
        />
      )}

      {actions.includes("start") && (
        <Icon
          name={mdiPlayBox}
          color="icon-default"
          className="cursor-pointer"
          disabled={disabled?.includes("start")}
          onClick={() => onStart?.(item.id as number)}
        />
      )}

      {actions.includes("stop") && (
        <Icon
          name={mdiStopCircle}
          color="icon-default"
          className="cursor-pointer"
          disabled={disabled?.includes("stop")}
          onClick={() => onStop?.(item.id as number)}
        />
      )}

      {actions.includes("withdraw") && (
        <Icon
          name={mdiCash}
          color="icon-primary"
          className="cursor-pointer"
          disabled={disabled?.includes("withdraw")}
          onClick={() => onWithdraw?.(item.id as number)}
        />
      )}

      {actions.includes("edit") && item.status !== 3 && (
        <Icon
          name={editIcon}
          color="icon-primary"
          className="cursor-pointer"
          disabled={disabled?.includes("edit")}
          onClick={() => onEdit?.(item)}
        />
      )}

      {actions.includes("delete") && item.status === 2 && (
        <Icon
          name={mdiDelete}
          color="icon-default"
          className="cursor-pointer"
          disabled={disabled?.includes("delete")}
          onClick={() => onDelete?.(item.id as number)}
        />
      )}
    </div>
  );
};
