import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";

import { AppDrawer, AppHeader, TableContainer, UnsavedChangesDialog } from "@containers";
import { emptyTradingContest, TradingContestForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { Autocomplete, Button, DataTable, Icon, TableFooter, TableItem, TextField } from "@ui-kit";
import { searchIcon } from "@utils";
import { debounce } from "lodash";

import { useTradingContestHeaders } from "./hooks/useTradingContestHeaders";

export const TradingContestPage = () => {
  const selectedTradingContest = useStore((s) => s.selectedTradingContest);
  const setSelectedTradingContest = useStore((s) => s.setSelectedTradingContest);
  const setDialogs = useStore((s) => s.setDialogs);
  const { headers } = useTradingContestHeaders();
  const [params, setParams] = useState({
    currentPage: 1,
    pageSize: 10,
    search: "",
    marketSymbols: [] as string[],
  });
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tradingPairs, setTradingPairs] = useState([]);

  const debouncedSearchTermChange = useRef(
    debounce((search: string) => {
      setParams((prev) => ({ ...prev, search }));
      canFetch.current = true;
    }, 500)
  ).current;

  const handleSearchChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(value);
    debouncedSearchTermChange(value);
  };

  const handlePageChange = (currentPage: number) => {
    setParams((prev) => ({ ...prev, currentPage }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleCreate = () => {
    setSelectedTradingContest(emptyTradingContest);
  };

  const handleTradingPairChange = (marketSymbols: string[]) => {
    setParams((prev) => ({ ...prev, marketSymbols }));
    canFetch.current = true;
  };

  const getTradingPairs = async () => {
    try {
      const { data } = await api.get("/bo/api/markets/all?page=1&pageSize=10000");
      setTradingPairs(
        data.data.items
          .filter((item: { status: number }) => item.status === 1)
          .map((item: { name: string }) => ({ ...item, id: item.name }))
      );
    } catch (err) {
      console.error("Error", err);
    }
  };

  const getTradingContests = useCallback(async () => {
    try {
      setLoading(true);

      const searchParams = new URLSearchParams();
      searchParams.append("currentPage", String(params.currentPage));
      searchParams.append("pageSize", String(params.pageSize));
      if (params.search) {
        searchParams.append("search", params.search);
      }
      if (params.marketSymbols.length) {
        params.marketSymbols.forEach((marketSymbol) => searchParams.append("marketSymbols", marketSymbol));
      }

      const { data } = await api.get("/bo/api/tradeContests", { params: searchParams });

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void getTradingPairs();
  }, []);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getTradingContests();
    }
  }, [getTradingContests]);

  return (
    <div>
      <AppHeader
        title="Trading Contest"
        MainButton={items.length ? <Button onClick={handleCreate}>Create Contest</Button> : undefined}
      />

      <TableContainer className="flex flex-col gap-4">
        <div className="flex justify-between p-0.5">
          <TextField
            value={searchValue}
            placeholder="Search by UID, Contest Name"
            hideDetails
            className="w-[202px]"
            prependInner={<Icon name={searchIcon} className="mr-2" />}
            onChange={handleSearchChange}
          />

          <div className="w-[250px]">
            <Autocomplete
              selectedItems={params.marketSymbols}
              placeholder="Trading Pairs"
              items={tradingPairs}
              onChange={handleTradingPairChange}
            />
          </div>
        </div>

        <div className="overflow-auto">
          <DataTable
            headers={headers}
            items={items as unknown as TableItem[]}
            loading={loading}
            noDataContent={<Button onClick={handleCreate}>Create Contest</Button>}
            hideFooter
          />
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

      <AppDrawer open={!!selectedTradingContest} onOpenChange={() => setSelectedTradingContest(null)}>
        <TradingContestForm onSuccess={getTradingContests} />
      </AppDrawer>

      <UnsavedChangesDialog
        onConfirm={() => {
          setDialogs([]);
          setSelectedTradingContest(null);
        }}
      />
    </div>
  );
};
