import { useCallback, useEffect, useState } from "react";
import { useRef } from "react";

import { TradingHistoryFiltersFormValues } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { ENUM_TRADING_HISTORY_SEARCH_TERM } from "@types";
import {
  Button,
  DataTable,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Icon,
  TableFooter,
  TableItem,
  TextField,
  Typography,
} from "@ui-kit";
import { searchIcon } from "@utils";
import { omit } from "lodash";

import { TableContainer } from "../../table-container";
import { useTradingContestTradeHistoryHeaders } from "./hooks/useTradingContestTradeHistoryHeaders";

interface TradingContestTradeHistoryProps {
  tradingPairs: string[];
  joinedAt: string;
}

export const TradingContestTradeHistory = ({ tradingPairs, joinedAt }: TradingContestTradeHistoryProps) => {
  const selectedTradingContestCustomer = useStore((s) => s.selectedTradingContestCustomer);
  const setSelectedTradingContestCustomer = useStore((s) => s.setSelectedTradingContestCustomer);
  const { headers } = useTradingContestTradeHistoryHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    filters: {
      marketSymbolPairs: tradingPairs,
      createdAt: [],
    } as TradingHistoryFiltersFormValues,
    searchCriteria: [
      {
        searchTerm: ENUM_TRADING_HISTORY_SEARCH_TERM.OrderId,
        value: "",
      },
    ],
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleClose = () => {
    setSelectedTradingContestCustomer(null);
  };

  const getTradingHistory = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post(
        `/trx/api/transactionMonitoring/customers/${selectedTradingContestCustomer?.id}/trades`,
        {
          ...omit(params, "searchCriteria"),
          filters: {
            ...omit(params.filters, "createdAt"),
            createdFrom: new Date(joinedAt),
            [params.searchCriteria[0].searchTerm]: params.searchCriteria[0].value
              ? [Number(params.searchCriteria[0].value)]
              : undefined,
          },
        }
      );

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedTradingContestCustomer?.id, joinedAt, params]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getTradingHistory();
    }
  }, [getTradingHistory]);

  return (
    <div className="flex h-full flex-col">
      <DrawerHeader className="flex flex-col items-start justify-center gap-0">
        <DrawerTitle>Trade History</DrawerTitle>
        <Typography variant="body-sm" color="secondary">
          UID: {selectedTradingContestCustomer?.identityId}
        </Typography>
      </DrawerHeader>

      <div className="border-b px-4 py-3">
        <div className="w-[240px]">
          <TextField
            placeholder="Search by Trade ID"
            autoFocus
            hideDetails
            prependInner={<Icon name={searchIcon} className="mr-2" />}
          />
        </div>
      </div>

      <div className="max-h-[calc(100vh_-_11.25rem)] overflow-auto">
        <TableContainer>
          <div className="overflow-auto">
            <DataTable headers={headers} items={items as unknown as TableItem[]} loading={loading} hideFooter />
          </div>

          <table className="w-full">
            <TableFooter
              headersLength={headers.length}
              page={params.page}
              onPageChange={handlePageChange}
              itemsPerPage={params.pageSize}
              onItemsPerPageChange={handlePerPageChange}
              pageCount={totalPages}
              itemsTotalCount={totalRecords}
            />
          </table>
        </TableContainer>
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={handleClose}>
          Cancel
        </Button>

        <Button type="submit">Save</Button>
      </DrawerFooter>
    </div>
  );
};
