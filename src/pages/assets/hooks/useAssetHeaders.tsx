import { useMemo } from "react";

import { CopyToClipboard, TableAction, TableActionsCell, TableStatusCell, TableSwitchCell } from "@containers";
import { AssetFormValues } from "@forms";
import { useCheckPermission } from "@hooks";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { HeaderItem, Icon, TableItem } from "@ui-kit";

export const useAssetHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setAsset = useStore((s) => s.setAsset);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const actions = useMemo(() => {
    const tableActions: TableAction[] = ["deploy", "withdraw"];

    if (checkPermission("asset_update")) tableActions.push("edit");

    return tableActions;
  }, [checkPermission]);

  const handleDeploy = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["confirm"]);
  };

  const handleWithdraw = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["withdrawAsset"]);
  };

  const handleEdit = (item: TableItem) => {
    setAsset({
      ...item,
      contractSupply: item.contractSupply || "",
      contractName: item.contractName || "",
      contractSymbol: item.contractSymbol || "",
      contractAddress: item.contractAddress || "",
      contractDeployerAddress: item.contractDeployerAddress || "",
      contractAbi: item.contractAbi || "",
    } as AssetFormValues);
    setDialogMode("update");
    setDialogs(["asset"]);
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
      text: "network",
      value: (item) =>
        typeof item?.network === "object" && typeof item?.network?.name === "string" ? item?.network?.name : "",
      width: 80,
    },
    {
      text: "coin",
      value: (item) => (typeof item?.coin === "object" && typeof item?.coin?.name === "string" ? item?.coin?.name : ""),
    },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <TableStatusCell status={item.status} />,
    },
    {
      text: "",
      value: (item) => (
        <TableActionsCell
          actions={actions}
          item={item}
          onDeploy={handleDeploy}
          onWithdraw={handleWithdraw}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
      width: 112,
    },
    { text: "contract type", value: "contractType" },
    {
      text: "contract address",
      value: (item: TableItem) =>
        item.contractAddress && typeof item.contractAddress === "string" ? (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.contractAddress}>
              {item.contractAddress}
            </div>
            <CopyToClipboard text={item.contractAddress} size="iconSmall" />
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 160,
      maxWidth: 160,
    },
    {
      text: "contract deployer address",
      value: (item: TableItem) =>
        item.contractDeployerAddress && typeof item.contractDeployerAddress === "string" ? (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.contractDeployerAddress}>
              {item.contractDeployerAddress}
            </div>
            <CopyToClipboard text={item.contractDeployerAddress} size="iconSmall" />
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 210,
      maxWidth: 210,
    },
    {
      text: "contract abi",
      value: (item: TableItem) =>
        item.contractAbi && typeof item.contractAbi === "string" ? (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.contractAbi}>
              {item.contractAbi}
            </div>
            <CopyToClipboard text={item.contractAbi} size="iconSmall" />
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 160,
      maxWidth: 160,
    },
    { text: "contract name", value: "contractName" },
    { text: "contract symbol", value: "contractSymbol" },
    { text: "contract supply", value: "contractSupply", width: 80 },
  ];

  if (checkPermission("asset_update")) {
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
