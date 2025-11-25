import { TableStatusCell } from "@containers";
import { HeaderItem } from "@ui-kit";

export const useVaultAssetNodeHeaders = () => {
  const headers: HeaderItem[] = [
    { text: "name", value: "name" },
    { text: "rpc", value: "rpc", maxWidth: 200 },
    { text: "username", value: "username" },
    { text: "stack", value: "stack" },
    {
      text: "status",
      value: (item) => typeof item.status === "number" && <TableStatusCell status={item.status} />,
    },
  ];

  return {
    headers,
  };
};
