import { ENUM_TRADING_CONTEST_STATUS, ITradingContestDetails } from "@types";
import { ChipTypes, TextCell, Typography } from "@ui-kit";
import { formatAmount } from "@utils";

interface TradingContestDetailsCardProps {
  tradingContestDetails: ITradingContestDetails;
}

export const TradingContestDetailsCard = (props: TradingContestDetailsCardProps) => {
  const { tradingContestDetails } = props;

  const getStatusText = () => {
    switch (tradingContestDetails.state) {
      case ENUM_TRADING_CONTEST_STATUS.Future:
        return "Future";
      case ENUM_TRADING_CONTEST_STATUS.Active:
        return "Active";
      case ENUM_TRADING_CONTEST_STATUS.Finished:
        return "Finished";
      case ENUM_TRADING_CONTEST_STATUS.Distributed:
        return "Distributed";
      default:
        return "";
    }
  };

  const getStatusChipType = (): ChipTypes => {
    switch (tradingContestDetails.state) {
      case ENUM_TRADING_CONTEST_STATUS.Future:
        return "future";
      case ENUM_TRADING_CONTEST_STATUS.Active:
        return "active";
      case ENUM_TRADING_CONTEST_STATUS.Finished:
        return "finished";
      case ENUM_TRADING_CONTEST_STATUS.Distributed:
        return "distributed";
      default:
        return "default";
    }
  };

  return (
    <div className="relative flex flex-col gap-4 rounded-xl border bg-background-subtle p-4">
      <div className="flex flex-wrap gap-4">
        <TextCell title="Name" value={tradingContestDetails.name} className="w-[calc(50%_-_0.5rem)]" />
        <TextCell
          title="Duration"
          value={`${tradingContestDetails.startDate} ${tradingContestDetails.endDate}`}
          hasBorder={false}
          className="w-[calc(50%_-_0.5rem)]"
        />
        <TextCell
          title="Status"
          chipTitle={getStatusText()}
          chipType={getStatusChipType()}
          className="w-[calc(50%_-_0.5rem)]"
        />
        <TextCell
          title="Reward Currency"
          value={
            <div className="flex items-center gap-2">
              <img
                src={`/icons/currencies/${tradingContestDetails.prizeSymbol.toUpperCase()}.svg`}
                alt=""
                className="h-6 w-6"
              />
              <Typography variant="heading-4">{tradingContestDetails.prizeSymbol}</Typography>
            </div>
          }
          hasBorder={false}
          className="w-[calc(50%_-_0.5rem)]"
        />
        <TextCell
          title="Reward Amount"
          value={`${formatAmount(tradingContestDetails.prize)} ${tradingContestDetails.prizeSymbol}`}
          className="w-[calc(50%_-_0.5rem)]"
        />
        <TextCell
          title="Joined Participants"
          value={<Typography variant="heading-4">{tradingContestDetails.joinedCustomers}</Typography>}
          hasBorder={false}
          className="w-[calc(50%_-_0.5rem)]"
        />
        <TextCell
          title="Trading Volume"
          value={tradingContestDetails.tradingVolume ? formatAmount(tradingContestDetails.tradingVolume) : "-"}
          className="w-[calc(50%_-_0.5rem)]"
        />
        <TextCell
          title="Trading Pairs"
          value={tradingContestDetails.markets.map((market) => market.marketSymbol).join(", ")}
          hasBorder={false}
          className="w-[calc(50%_-_0.5rem)]"
        />
      </div>
    </div>
  );
};
