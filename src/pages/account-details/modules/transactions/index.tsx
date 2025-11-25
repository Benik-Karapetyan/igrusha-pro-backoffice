import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AccountsTableContainer } from "@containers";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import { api } from "@services";
import { useParams } from "@tanstack/react-router";
import { TCursors } from "@types";
import { Button, DataTable, Icon, Select, Typography } from "@ui-kit";
import { omit } from "lodash";

import { useTransactionHeaders } from "./hooks/useTransactionHeaders";
import { itemsPerPage } from "./transaction.consts";
import { TransactionsToolbar } from "./transactions-toolbar";

export const Transactions = () => {
  const { type } = useParams({ from: "/auth/accounts/$type/$id" });
  const { headers } = useTransactionHeaders();
  const [cursors, setCursors] = useState<TCursors>({
    previousCursor: null,
    nextCursor: null,
  });
  const [params, setParams] = useState({
    cursor: "",
    pageSize: 10,
    assetIds: [] as string[],
    transactionTypes: [] as string[],
  });
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const filteredItems = useMemo(
    () =>
      searchValue
        ? items.filter((item: { base: { currency: string } }) =>
            item.base.currency.toLowerCase().includes(searchValue.toLowerCase())
          )
        : items,
    [searchValue, items]
  );

  const handleSearchChange = (search: string) => {
    setSearchValue(search);
  };

  const handleCursorChange = (cursor: string) => {
    setParams((prev) => ({ ...prev, cursor }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAssetIdChange = (assetIds: string[]) => {
    setParams((prev) => ({ ...prev, assetIds }));
    canFetch.current = true;
  };

  const handleTransactionTypeChange = (transactionTypes: string[]) => {
    setParams((prev) => ({ ...prev, transactionTypes }));
    canFetch.current = true;
  };

  const getTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post(`/fin/api/transactions`, {
        accountType: type,
        filters: {
          ...omit(
            params,
            !params.assetIds.length ? "assetIds" : "",
            !params.transactionTypes.length ? "transactionTypes" : ""
          ),
        },
      });
      setItems(data.data);
      setCursors({ previousCursor: data.meta.previousCursor, nextCursor: data.meta.nextCursor });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type, params]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getTransactions();
    }
  }, [getTransactions]);

  return (
    <div className="flex flex-col gap-4">
      <TransactionsToolbar
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        assetIds={params.assetIds}
        onAssetIdsChange={handleAssetIdChange}
        transactionTypes={params.transactionTypes}
        onTransactionTypesChange={handleTransactionTypeChange}
      />

      <AccountsTableContainer>
        <div className="overflow-auto">
          <DataTable headers={headers} items={filteredItems} loading={loading} hideFooter />

          <div className="flex justify-end gap-5 pb-4 pt-8">
            <div className="flex items-center gap-3">
              <Typography variant="body-base">Results per page:</Typography>

              <Select
                value={String(params.pageSize)}
                items={itemsPerPage}
                width={104}
                hideDetails
                onValueChange={handlePerPageChange}
              />
            </div>

            <div className="flex gap-3">
              <Button
                className="w-[120px]"
                disabled={!cursors.previousCursor}
                onClick={() => handleCursorChange(cursors.previousCursor || "")}
              >
                <span className="inline-flex items-center gap-1 pr-2">
                  <Icon name={mdiChevronLeft} color="current" dense />
                  Previous
                </span>
              </Button>
              <Button
                className="w-[120px]"
                disabled={!cursors.nextCursor}
                onClick={() => handleCursorChange(cursors.nextCursor || "")}
              >
                <span className="inline-flex items-center gap-1 pl-3">
                  Next
                  <Icon name={mdiChevronRight} color="current" dense />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </AccountsTableContainer>
    </div>
  );
};
