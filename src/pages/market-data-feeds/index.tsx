import { useCallback, useEffect, useRef, useState } from "react";

import {
  AppToolbar,
  CreateUpdateDialog,
  DeleteDialog,
  StatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import { emptyMarketDataFeed, MarketDataFeedForm } from "@forms";
import { useCheckPermission } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { DataTable } from "@ui-kit";

import { useMarketDataFeedHeaders } from "./hooks/useMarketDataFeedHeaders";

export const MarketDataFeedsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const { headers } = useMarketDataFeedHeaders();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
  });
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setMarketDataFeed = useStore((s) => s.setMarketDataFeed);

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleAddClick = () => {
    setMarketDataFeed(emptyMarketDataFeed);
    setDialogMode("create");
    setDialogs(["marketDataFeed"]);
  };

  const getMarketDataFeeds = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/bo/api/marketDataFeeds/all", { params });
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
    if (!checkPermission("data_feed_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getMarketDataFeeds();
    }
  }, [checkPermission, navigate, getMarketDataFeeds]);

  return (
    <div>
      <AppToolbar
        hasCreatePermission={checkPermission("data_feed_create")}
        btnText="Add Market Data Feed"
        onAddClick={handleAddClick}
      />

      <TableContainer>
        <DataTable
          headers={headers}
          items={items}
          loading={loading}
          page={params.page}
          onPageChange={handlePageChange}
          itemsPerPage={params.pageSize}
          onItemsPerPageChange={handlePerPageChange}
          pageCount={totalPages}
          itemsTotalCount={totalRecords}
        />
      </TableContainer>

      <CreateUpdateDialog title="Market Data Feed" dialogType="marketDataFeed">
        <MarketDataFeedForm onSuccess={getMarketDataFeeds} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <StatusDialog title="Market Data Feed" updateUrl="marketDataFeeds" onSuccess={getMarketDataFeeds} />
      <DeleteDialog title="Market Data Feed" deleteUrl="marketDataFeeds" onSuccess={getMarketDataFeeds} />
    </div>
  );
};
