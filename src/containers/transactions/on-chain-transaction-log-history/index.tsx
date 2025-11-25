import { useCallback, useEffect, useRef, useState } from "react";

import { mdiWalletOutline } from "@mdi/js";
import { api } from "@services";
import { useStore } from "@store";
import { DataTable, Icon, TableFooter } from "@ui-kit";

import { useOnChainTransactionLogHistoryHeaders } from "./hooks/useOnChainTransactionLogHistoryHeaders";

export const OnChainTransactionLogHistory = () => {
  const selectedOnChainTransaction = useStore((s) => s.selectedOnChainTransaction);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [transactionLogHistory, setTransactionLogHistory] = useState([]);
  const { headers } = useOnChainTransactionLogHistoryHeaders();

  const getOnChainTransactionLogHistory = useCallback(async () => {
    try {
      const { data } = await api.get(
        `/trx/api/transactionMonitoring/transactions/${selectedOnChainTransaction?.transactionId}?type=${selectedOnChainTransaction?.kind}`
      );
      setTransactionLogHistory(data.history);
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  }, [selectedOnChainTransaction]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getOnChainTransactionLogHistory();
    }
  }, [getOnChainTransactionLogHistory]);

  return transactionLogHistory.length ? (
    <div className="rounded-xl">
      <div className="w-full overflow-hidden rounded-xl border">
        <div className="overflow-auto">
          <DataTable headers={headers} items={transactionLogHistory} loading={loading} hideFooter />
        </div>

        <table className="w-full">
          <TableFooter
            headersLength={headers.length}
            page={1}
            itemsPerPage={50}
            pageCount={1}
            itemsTotalCount={transactionLogHistory.length}
          />
        </table>
      </div>
    </div>
  ) : (
    <div className="flex h-[calc(100vh_-_72px)] min-h-[400px] items-center justify-center p-5">
      <div className="flex max-w-[501px] -translate-y-10 flex-col items-center gap-6 text-center text-foreground-muted-more">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-3xl border">
          <Icon name={mdiWalletOutline} color="current" size={36} />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold">Unable to Retrieve Transaction Details</h3>

          <p>We're having trouble retrieving transaction details.</p>
          <p>Please refresh to try again.</p>
        </div>
      </div>
    </div>
  );
};
