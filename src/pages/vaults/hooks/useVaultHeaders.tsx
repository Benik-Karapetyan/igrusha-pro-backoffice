import { useMemo } from "react";

import { TableAction, TableActionsCell, TableStatusCell, TableSwitchCell } from "@containers";
import { VaultFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { IVaultAsset, useStore } from "@store";
import { Button, HeaderItem, TableItem } from "@ui-kit";

export const useVaultHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setVaultAssets = useStore((s) => s.setVaultAssets);
  const setVault = useStore((s) => s.setVault);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = ["withdraw"];

    if (checkPermission("vault_update")) tableActions.push("edit");
    if (checkPermission("vault_delete")) tableActions.push("delete");

    return tableActions;
  }, [checkPermission]);

  const handleDetailsClick = (item: TableItem) => {
    setVaultAssets((item as unknown as { vaultAssets: IVaultAsset[] }).vaultAssets);
    setDialogs(["vaultAssets"]);
  };

  const handleWithdraw = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["withdrawVault"]);
  };

  const handleEdit = (item: TableItem) => {
    const vaultAssets = (item.vaultAssets as unknown as { asset: { id: number }; nodes: { id: number }[] }[]).map(
      (v) => ({
        ...v,
        assetId: v.asset.id,
        nodeIds: v.nodes.map((n) => n.id),
      })
    );
    setVault({ ...item, vaultAssets } as unknown as VaultFormValues);
    setDialogMode("update");
    setDialogs(["vault"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "name", value: "name" },
    { text: "key", value: "key" },
    { text: "type", value: "type" },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <TableStatusCell status={item.status} />,
    },
    {
      text: "vault assets",
      value: (item) => (
        <Button variant="link" size="link" onClick={() => handleDetailsClick(item)}>
          Details
        </Button>
      ),
    },
    {
      text: "",
      value: (item) => (
        <TableActionsCell
          actions={actions}
          item={item}
          onWithdraw={handleWithdraw}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
      width: 120,
    },
  ];

  if (checkPermission("vault_update")) {
    headers.splice(5, 0, {
      text: "enabled",
      value: (item) =>
        typeof item?.status === "number" && <TableSwitchCell status={item.status} id={item.id as number} />,
    });
  }

  return {
    headers,
  };
};
