import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { Link } from "@tanstack/react-router";
import {
  Button,
  HeaderItem,
  Icon,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@ui-kit";
import { excludeIcon, formatAmount, historyIcon } from "@utils";

export const useLeaderboardHeaders = () => {
  const setSelectedExcludeCustomerId = useStore((s) => s.setSelectedExcludeCustomerId);
  const setSelectedTradingContestCustomer = useStore((s) => s.setSelectedTradingContestCustomer);

  const headers: HeaderItem[] = [
    {
      text: "rank",
      value: "rank",
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "UID",
      value: (item) =>
        typeof item.customerId === "string" &&
        typeof item.user === "object" &&
        typeof item.user?.identityId === "string" && (
          <Link to={`/customers/$id`} params={{ id: item.customerId }}>
            <Typography variant="link" color="link" className="underline underline-offset-4">
              {item.user.identityId}
            </Typography>
          </Link>
        ),
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "email",
      value: (item) =>
        typeof item.user === "object" && typeof item.user?.email === "string" && <div>{item.user.email}</div>,
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "total trading volume",
      value: (item) =>
        typeof item.usdTotalSum === "number" ? (
          <div className="flex items-center gap-1">
            <Typography>{formatAmount(item.usdTotalSum)}</Typography>
            <Typography>USD</Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "assigned reward amount",
      value: (item) => (
        <div className="flex items-center justify-between gap-3 p-1">
          {typeof item.rewardAmount === "number" && typeof item.rewardSymbol === "string" ? (
            <div className="flex items-center gap-1">
              <Typography>{formatAmount(item.rewardAmount)}</Typography>
              <Typography>{item.rewardSymbol}</Typography>
            </div>
          ) : (
            <Icon name={mdiMinus} dense />
          )}

          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="iconXSmall"
                    onClick={() =>
                      setSelectedTradingContestCustomer({
                        id: item.customerId as number,
                        identityId: (item.user as { identityId: string }).identityId,
                        tradingPairs: [],
                        joinedAt: item.createdAt as string,
                      })
                    }
                  >
                    <Icon name={historyIcon} color="icon-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <TooltipArrow />
                  <Typography variant="body-sm" color="inverse">
                    Trade History
                  </Typography>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="iconXSmall"
                    onClick={() => setSelectedExcludeCustomerId(item.customerId as string)}
                  >
                    <Icon name={excludeIcon} color="icon-error" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <TooltipArrow />
                  <Typography variant="body-sm" color="inverse">
                    Exclude Customer
                  </Typography>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ),
      width: "20%",
      maxWidth: "20%",
    },
  ];

  return {
    headers,
  };
};
