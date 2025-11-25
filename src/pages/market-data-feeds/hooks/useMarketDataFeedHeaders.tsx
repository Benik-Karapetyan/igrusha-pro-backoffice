import { useMemo } from "react";

import { TableAction, TableActionsCell, TableStatusCell, TableSwitchCell } from "@containers";
import { MarketDataFeedFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { useStore } from "@store";
import { HeaderItem, TableItem } from "@ui-kit";

export const useMarketDataFeedHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setMarketDataFeed = useStore((s) => s.setMarketDataFeed);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];

    if (checkPermission("data_feed_update")) tableActions.push("edit");
    if (checkPermission("data_feed_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleEdit = (item: TableItem) => {
    setMarketDataFeed(item as MarketDataFeedFormValues);
    setDialogMode("update");
    setDialogs(["marketDataFeed"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "name", value: "name" },
    { text: "key", value: "key" },
    { text: "url", value: "url" },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <TableStatusCell status={item.status} />,
    },
    {
      text: "",
      value: (item) => <TableActionsCell actions={actions} item={item} onEdit={handleEdit} onDelete={handleDelete} />,
      width: 80,
    },
  ];

  if (checkPermission("data_feed_update")) {
    headers.splice(4, 0, {
      text: "enabled",
      value: (item) =>
        typeof item?.status === "number" && <TableSwitchCell status={item.status} id={item.id as number} />,
    });
  }

  return {
    headers,
  };
};
