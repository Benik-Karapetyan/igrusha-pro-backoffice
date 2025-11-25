import { TableStatusCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { INode, useStore } from "@store";
import { Button, HeaderItem, Icon, TableItem } from "@ui-kit";

export const useVaultAssetHeaders = () => {
  const setSelectedVaultAssetNodes = useStore((s) => s.setSelectedVaultAssetNodes);

  const handleDetailsClick = (item: TableItem) => {
    setSelectedVaultAssetNodes((item as unknown as { nodes: INode[] }).nodes);
  };

  const headers: HeaderItem[] = [
    {
      text: "name",
      value: (item) =>
        typeof item.asset === "object" && typeof item.asset.name === "string" ? (
          item.asset.name
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "key",
      value: (item) =>
        typeof item.asset === "object" && typeof item.asset.key === "string" && item.asset.key ? (
          item.asset.key
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    { text: "type", value: "type" },
    {
      text: "status",
      value: (item) =>
        typeof item.asset === "object" &&
        typeof item.asset.status === "number" && <TableStatusCell status={item.asset.status} />,
    },
    {
      text: "nodes",
      value: (item) =>
        Array.isArray(item.nodes) && item.nodes.length ? (
          <Button variant="link" size="link" onClick={() => handleDetailsClick(item)}>
            Details
          </Button>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
  ];

  return {
    headers,
  };
};
