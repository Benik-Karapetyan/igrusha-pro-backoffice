import { mdiMinus } from "@mdi/js";
import {
  HeaderItem,
  Icon,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@ui-kit";
import { formatScientificToFullNumber, warningIcon } from "@utils";

export const useWithdrawalThresholdHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "assets",
      value: (item) =>
        typeof item.coin === "object" && typeof item.coin.symbol === "string" ? (
          <div className="flex items-center gap-2">
            <img src={`/icons/currencies/${item.coin.symbol.toUpperCase()}.svg`} alt="" className="h-6 w-6" />
            {item.coin.symbol}
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "50%",
    },
    {
      text: "min payout",
      value: (item) => (
        <div className="flex items-center justify-between gap-2">
          {typeof item.amount === "number" && item.amount > 0 ? (
            formatScientificToFullNumber(item.amount)
          ) : (
            <>
              0
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Icon name={warningIcon} color="icon-warning" />
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end">
                    <TooltipArrow />
                    <Typography variant="body-sm" color="inverse" className="max-w-[284px] whitespace-normal">
                      The minimum payout threshold is not set. Please ensure it aligns with the minimum amount users are
                      allowed to claim from referral rewards.
                    </Typography>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      ),
      width: "50%",
    },
  ];

  return {
    headers,
  };
};
