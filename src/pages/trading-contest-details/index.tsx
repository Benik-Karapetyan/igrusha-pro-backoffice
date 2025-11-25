import { useCallback, useEffect, useRef, useState } from "react";

import { AppHeader } from "@containers";
import { TradingContestDetailsCard } from "@containers";
import { api } from "@services";
import { useStore } from "@store";
import { useParams } from "@tanstack/react-router";
import { ENUM_TRADING_CONTEST_STATUS, ITradingContestDetails } from "@types";
import { Button, ProgressCircular } from "@ui-kit";

import { LeaderBoard } from "./leaderboard";

export const TradingContestDetailsPage = () => {
  const { id } = useParams({ from: "/auth/trading-contest/$id" });
  const setSelectedDistributeRewardsId = useStore((s) => s.setSelectedDistributeRewardsId);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [tradingContestDetails, setTradingContestDetails] = useState<ITradingContestDetails | null>(null);

  const getTradingContest = useCallback(async () => {
    try {
      const { data } = await api.get(`/bo/api/tradeContests/${id}`);
      setTradingContestDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getTradingContest();
    }
  }, [getTradingContest]);

  return (
    <div>
      <AppHeader
        backUrl="/trading-contest"
        title={id}
        MainButton={
          tradingContestDetails?.state === ENUM_TRADING_CONTEST_STATUS.Finished ? (
            <Button onClick={() => setSelectedDistributeRewardsId(+id)}>Distribute Rewards</Button>
          ) : null
        }
      />

      {loading || !tradingContestDetails ? (
        <div className="p-5">
          <div className="flex justify-center rounded-xl border bg-white p-5 text-primary">
            <ProgressCircular indeterminate />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-4">
          <TradingContestDetailsCard tradingContestDetails={tradingContestDetails} />

          <LeaderBoard tradingPairs={tradingContestDetails.markets.map((market) => market.marketSymbol)} />
        </div>
      )}
    </div>
  );
};
