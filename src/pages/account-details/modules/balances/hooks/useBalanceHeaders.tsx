import { AssetTransferFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { useParams } from "@tanstack/react-router";
import { TBalanceItem } from "@types";
import {
  HeaderItem,
  Icon,
  TableItem,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@ui-kit";
import { formatAmount, transferIcon } from "@utils";

export const useBalanceHeaders = () => {
  const { type } = useParams({ from: "/auth/accounts/$type/$id" });
  const currentUser = useStore((s) => s.auth.user);
  const setDrawerOpen = useStore((s) => s.setDrawerOpen);
  const setAssetTransfer = useStore((s) => s.setAssetTransfer);

  const handleTransfer = (item: TableItem) => {
    setAssetTransfer({
      totalBalance: item.totalBalance,
      initiator: currentUser?.identityId,
      asset: { name: item.assetId as string, symbol: item.assetId as string },
      from: {
        type,
        allocation: "Available",
      },
      to: {
        type: "",
        allocation: "Available",
      },
      amount: "",
    } as AssetTransferFormValues);
    setDrawerOpen(true);
  };

  const headers: HeaderItem[] = [
    {
      text: "asset",
      value: (item) =>
        typeof item.assetId === "string" ? (
          <div className="flex items-center gap-2">
            <img src={`/icons/currencies/${item.assetId.toUpperCase()}.svg`} alt="" className="h-6 w-6" />
            {item.assetId}
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "total balance",
      value: (item) =>
        typeof item.totalBalance === "object" ? (
          <div className="flex items-center gap-2">
            <div className="grow">{formatAmount((item.totalBalance as TBalanceItem).base.amount)}</div>
            <Typography variant="body-sm" color="secondary">
              {formatAmount((item.totalBalance as TBalanceItem).quote?.amount)}{" "}
              {(item.totalBalance as TBalanceItem).quote?.currency}
            </Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    { text: "1H change", value: "fullName" },
    {
      text: "24H change",
      value: "fullName",
    },
    {
      text: "",
      value: (item) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Icon
                name={transferIcon}
                color="icon-primary"
                className="cursor-pointer"
                onClick={() => handleTransfer(item)}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              <TooltipArrow />

              <Typography variant="body-sm" color="inverse">
                Transfer
              </Typography>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
      width: 48,
    },
  ];

  return {
    headers,
  };
};
