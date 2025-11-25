import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppDrawer,
  DistributeRewardsDialog,
  ExcludeCustomerDialog,
  TableContainer,
  TradingContestTradeHistory,
} from "@containers";
import { api } from "@services";
import { useStore } from "@store";
import { useParams } from "@tanstack/react-router";
import { DataTable, TableFooter, TableItem, TextField, Typography } from "@ui-kit";
import { Icon } from "@ui-kit";
import { searchIcon } from "@utils";

import { useLeaderboardHeaders } from "./hooks/useLeaderboardHeaders";

interface LeaderBoardProps {
  tradingPairs: string[];
}

export const LeaderBoard = ({ tradingPairs }: LeaderBoardProps) => {
  const { id } = useParams({ from: "/auth/trading-contest/$id" });
  const selectedTradingContestCustomer = useStore((s) => s.selectedTradingContestCustomer);
  const setSelectedTradingContestCustomer = useStore((s) => s.setSelectedTradingContestCustomer);
  const { headers } = useLeaderboardHeaders();
  const [params, setParams] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const handlePageChange = (currentPage: number) => {
    setParams((prev) => ({ ...prev, currentPage }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const getLeaderboard = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/bo/api/tradeContests/rankings/leaderboard/${id}`, {
        params,
      });

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, params]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getLeaderboard();
    }
  }, [getLeaderboard]);

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="heading-4">Leaderboard</Typography>

      <div className="-m-4">
        <TableContainer className="flex flex-col gap-4">
          {!!items.length && (
            <div className="w-[240px]">
              <TextField
                placeholder="Search by UID"
                hideDetails
                prependInner={<Icon name={searchIcon} className="mr-2" />}
              />
            </div>
          )}

          <div className="overflow-auto">
            <DataTable headers={headers} items={items as unknown as TableItem[]} loading={loading} hideFooter />
          </div>

          <table className="w-full">
            <TableFooter
              headersLength={headers.length}
              page={params.currentPage}
              onPageChange={handlePageChange}
              itemsPerPage={params.pageSize}
              onItemsPerPageChange={handlePerPageChange}
              pageCount={totalPages}
              itemsTotalCount={totalRecords}
            />
          </table>
        </TableContainer>
      </div>

      <AppDrawer
        open={!!selectedTradingContestCustomer?.id}
        onOpenChange={() => setSelectedTradingContestCustomer(null)}
        size="xl"
      >
        <TradingContestTradeHistory
          tradingPairs={tradingPairs}
          joinedAt={selectedTradingContestCustomer?.joinedAt || ""}
        />
      </AppDrawer>

      <DistributeRewardsDialog onSuccess={getLeaderboard} />
      <ExcludeCustomerDialog onSuccess={getLeaderboard} />
    </div>
  );
};
