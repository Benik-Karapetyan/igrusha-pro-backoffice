import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { api } from "@services";
import { useStore } from "@store";
import { DataTable, TableFooter } from "@ui-kit";
import { cn } from "@utils";

import { useTradingHistoryHeaders } from "../../trading-history/hooks/useTradingHistoryHeaders";

interface ExpandContentProps {
  orderId?: number;
}

export const ExpandContent: FC<ExpandContentProps> = ({ orderId }) => {
  const { headers } = useTradingHistoryHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const isAppSidebarMini = useStore((s) => s.isAppSidebarMini);
  const [hasScroll, setHasScroll] = useState(false);

  const maxWidth = useMemo(() => {
    const scrollWidth = hasScroll ? 7 : 0;
    return isAppSidebarMini ? `calc(100vw - ${64 + scrollWidth}px)` : `calc(100vw - ${346 + scrollWidth}px)`;
  }, [isAppSidebarMini, hasScroll]);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const getTradingHistory = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/trx/api/transactionMonitoring/trades", {
        ...params,
        filters: { orderIds: [orderId] },
      });

      setItems(data.items);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params, orderId]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getTradingHistory();
    }
  }, [getTradingHistory]);

  useEffect(() => {
    const checkScroll = () => {
      setHasScroll(document.documentElement.scrollHeight > window.innerHeight);
    };

    checkScroll();

    window.addEventListener("resize", checkScroll);

    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  return (
    <div className={cn("p-5")} style={{ maxWidth }}>
      <div className="w-full overflow-hidden rounded-xl border">
        <div className="overflow-auto">
          <DataTable headers={headers} items={items} loading={loading} hideFooter />
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
      </div>
    </div>
  );
};
