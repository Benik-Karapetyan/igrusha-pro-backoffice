import { TradingContestStatusCell } from "@containers";
import { TradingContestFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { ENUM_TRADING_CONTEST_STATUS } from "@types";
import { Button, HeaderItem, Icon, TableItem, Typography } from "@ui-kit";
import { editIcon, formatAmount, imageIcon, viewIcon } from "@utils";
import { format } from "date-fns";
import { pick } from "lodash";

export const useTradingContestHeaders = () => {
  const navigate = useNavigate();
  const setSelectedTradingContest = useStore((s) => s.setSelectedTradingContest);

  const handleEdit = (item: TableItem) => {
    setSelectedTradingContest({
      ...pick(item, "id", "name", "description", "prizeSymbol", "imageTag"),
      ...(typeof item.startDate === "string" && typeof item.endDate === "string"
        ? { duration: [format(item.startDate, "yyyy-MM-dd"), format(item.endDate, "yyyy-MM-dd")] }
        : {}),
      markets: Array.isArray(item?.markets)
        ? item?.markets?.map((market: { marketSymbol: string }) => market.marketSymbol)
        : [],
      rewards:
        typeof item.distributionRule === "object" && Array.isArray(item.distributionRule.places)
          ? item.distributionRule.places
          : [],
    } as unknown as TradingContestFormValues);
  };

  const headers: HeaderItem[] = [
    {
      text: "",
      value: (item) =>
        item.imageTag && typeof item.imageTag === "string" ? (
          <div className="py-2">
            <img src={item.imageTag} alt="contest" width={107} height={64} className="rounded-md object-cover" />
          </div>
        ) : (
          <div className="py-2">
            <div className="flex h-[64px] w-[107px] items-center justify-center rounded-md bg-background-surface">
              <Icon name={imageIcon} />
            </div>
          </div>
        ),
      width: 131,
      maxWidth: 131,
    },
    {
      text: "ID",
      value: "id",
      width: 90,
      maxWidth: 90,
    },
    { text: "name", value: "name", width: 200, maxWidth: 200 },
    {
      text: "duration",
      value: (item) =>
        typeof item.startDate === "string" && typeof item.endDate === "string" ? (
          <div className="flex flex-col gap-1">
            <Typography>{format(item.startDate, "yyyy-MM-dd HH:mm")}</Typography>
            <Typography variant="body-sm" color="secondary">
              {format(item.endDate, "yyyy-MM-dd HH:mm")}
            </Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 150,
      maxWidth: 150,
    },
    {
      text: "status",
      value: (item) => typeof item.state === "number" && <TradingContestStatusCell status={item.state} />,
      width: 123,
      maxWidth: 123,
    },
    {
      text: "reward currency",
      value: (item) =>
        typeof item.prizeSymbol === "string" ? (
          <div className="flex items-center gap-2">
            <img src={`/icons/currencies/${item.prizeSymbol.toUpperCase()}.svg`} alt="" className="h-6 w-6" />
            <div className="w-[100px]">{item.prizeSymbol}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 155,
      maxWidth: 155,
    },
    {
      text: "reward amount",
      value: (item) => (typeof item.prize === "number" ? formatAmount(item.prize) : <Icon name={mdiMinus} dense />),
      width: 155,
      maxWidth: 155,
    },
    {
      text: "joined participants",
      value: "joinedCustomers",
      width: 155,
      maxWidth: 155,
    },
    {
      text: "trading volume",
      value: (item) => (
        <div className="flex items-center justify-between gap-3 p-1">
          {typeof item.tradingVolume === "number" ? (
            `${formatAmount(item.tradingVolume)} USD`
          ) : (
            <Icon name={mdiMinus} dense />
          )}

          <div className="flex items-center gap-3">
            {item.state !== ENUM_TRADING_CONTEST_STATUS.Finished &&
              item.state !== ENUM_TRADING_CONTEST_STATUS.Distributed && (
                <Button variant="ghost" size="iconXSmall" onClick={() => handleEdit(item)}>
                  <Icon name={editIcon} color="icon-primary" />
                </Button>
              )}
            <Button
              variant="ghost"
              size="iconXSmall"
              onClick={() => navigate({ to: "/trading-contest/$id", params: { id: String(item.id) } })}
            >
              <Icon name={viewIcon} color="icon-primary" />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return {
    headers,
  };
};
