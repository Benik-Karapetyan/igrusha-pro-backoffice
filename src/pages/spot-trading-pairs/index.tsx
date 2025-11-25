import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  AppToolbar,
  ConfirmDialog,
  CreateUpdateDialog,
  DeleteDialog,
  FilterBar,
  SpotTradingPairMatchingDialog,
  SpotTradingPairStatusDialog,
  TableContainer,
  UnsavedChangesDialog,
} from "@containers";
import {
  emptySpotTradingPair,
  SpotTradingPairFiltersForm,
  SpotTradingPairFiltersFormValues,
  SpotTradingPairForm,
} from "@forms";
import { useCheckPermission, useToast } from "@hooks";
import { api } from "@services";
import { ISelectedSpotTradingPair, useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { FilterItem, RangeItem } from "@types";
import { DataTable, TableFooter } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { differenceInMinutes } from "date-fns";
import { debounce, omit } from "lodash";

import { useSpotTradingPairFilters } from "./hooks/useSpotTradingPairFilters";
import { useSpotTradingPairHeaders } from "./hooks/useSpotTradingPairHeaders";

export const SpotTradingPairsPage = () => {
  const navigate = useNavigate();
  const { checkPermission } = useCheckPermission();
  const toast = useToast();
  const { headers } = useSpotTradingPairHeaders();
  const {
    filters,
    loading: filtersLoading,
    serverError,
    coins,
    marketCategories,
    fetchFilterOptions,
    mapFilters,
  } = useSpotTradingPairFilters();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    orders: [{ column: 1, isDescending: true }],
    filters: [] as FilterItem[],
    ranges: [] as RangeItem[],
    searchTerm: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setSpotTradingPair = useStore((s) => s.setSpotTradingPair);
  const allSpotTradingPairsSelected = useStore((s) => s.allSpotTradingPairsSelected);
  const selectedSpotTradingPairs = useStore((s) => s.selectedSpotTradingPairs);
  const setSelectedSpotTradingPairs = useStore((s) => s.setSelectedSpotTradingPairs);
  const [confirmDialogTitle, setConfirmDialogTitle] = useState("");
  const [confirmDialogText, setConfirmDialogText] = useState("");
  const [confirmDialogBtnText, setConfirmDialogBtnText] = useState("");
  const [confirmBtnLoading, setConfirmBtnLoading] = useState(false);

  const showCancelBtn = useMemo(
    () => checkPermission("markets_list_update") && selectedSpotTradingPairs.some((tp) => tp.status !== "Deleted"),
    [checkPermission, selectedSpotTradingPairs]
  );

  const showDisableBtn = useMemo(
    () =>
      checkPermission("markets_list_update") &&
      selectedSpotTradingPairs.some((tp) => tp.status !== "Inactive" && tp.status !== "Deleted"),
    [checkPermission, selectedSpotTradingPairs]
  );

  const showBlockBtn = useMemo(
    () =>
      checkPermission("markets_list_update") &&
      selectedSpotTradingPairs.some(
        (tp) => tp.status !== "Blocked" && tp.status !== "Inactive" && tp.status !== "Deleted"
      ),
    [checkPermission, selectedSpotTradingPairs]
  );

  const showUnblockBtn = useMemo(
    () => checkPermission("markets_list_update") && selectedSpotTradingPairs.some((tp) => tp.status === "Blocked"),
    [checkPermission, selectedSpotTradingPairs]
  );

  const debouncedSearchTermChange = useRef(
    debounce((searchTerm: string) => {
      setParams((prev) => ({ ...prev, searchTerm }));
      canFetch.current = true;
    }, 500)
  ).current;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearchTermChange(value);
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
    canFetch.current = true;
  };

  const handlePerPageChange = (pageSize: string | number) => {
    setParams((prev) => ({ ...prev, pageSize: +pageSize }));
    canFetch.current = true;
  };

  const handleFilter = useCallback(
    (spotTradingPairFilters: SpotTradingPairFiltersFormValues) => {
      const { filters, ranges } = mapFilters(spotTradingPairFilters);
      setParams((prev) => ({ ...prev, filters, ranges }));
      canFetch.current = true;
    },
    [mapFilters]
  );

  const handleCancelClick = () => {
    setConfirmDialogTitle("Cancel Open Orders?");
    setConfirmDialogText("Are you sure you want to cancel open orders for the selected trading pair(s)?");
    setConfirmDialogBtnText("Confirm");
    setDialogs(["confirm"]);
  };

  const handleDisableClick = () => {
    setConfirmDialogTitle("Disable Spot Trading Pair(s)?");
    setConfirmDialogText("Are you sure you want to disable the selected trading pair(s)?");
    setConfirmDialogBtnText("Disable");
    setDialogs(["confirm"]);
  };

  const handleBlockClick = () => {
    setConfirmDialogTitle("Block Spot Trading Pair(s)?");
    setConfirmDialogText("Are you sure you want to block the selected trading pair(s)?");
    setConfirmDialogBtnText("Block");
    setDialogs(["confirm"]);
  };

  const handleUnblockClick = () => {
    setConfirmDialogTitle("Unblock Spot Trading Pair(s)?");
    setConfirmDialogText("Are you sure you want to unblock the selected trading pair(s)?");
    setConfirmDialogBtnText("Unblock");
    setDialogs(["confirm"]);
  };

  const handleCancelOrders = () => {
    const pairsToCancel = selectedSpotTradingPairs.filter((tp) => tp.status !== "Deleted");

    pairsToCancel.forEach(async (tp, i) => {
      try {
        await api.post(`/bo/api/orders/cancel/all/${tp.id}`);

        if (i === pairsToCancel.length - 1) {
          setDialogs([]);
          getSpotTradingPairs();
          toast.success("All orders have been canceled!");
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        if (i === pairsToCancel.length - 1) {
          setConfirmBtnLoading(false);
        }
      }
    });
  };

  const handleDisable = () => {
    const pairsToDisable = selectedSpotTradingPairs.filter((tp) => tp.status !== "Inactive" && tp.status !== "Deleted");

    pairsToDisable.forEach(async (tp, i) => {
      try {
        await api.patch(`/bo/api/markets/${tp.id}/disable`, omit(tp, "id"));

        if (i === pairsToDisable.length - 1) {
          setDialogs([]);
          getSpotTradingPairs();
          toast.success("Trading pair(s) have been disabled!");
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        if (i === pairsToDisable.length - 1) {
          setConfirmBtnLoading(false);
        }
      }
    });
  };

  const handleBlock = () => {
    const pairsToBlock = selectedSpotTradingPairs.filter(
      (tp) => tp.status !== "Blocked" && tp.status !== "Inactive" && tp.status !== "Deleted"
    );

    pairsToBlock.forEach(async (tp, i) => {
      try {
        await api.patch(`/bo/api/markets/${tp.id}/block`, omit(tp, "id"));

        if (i === pairsToBlock.length - 1) {
          setDialogs([]);
          getSpotTradingPairs();
          toast.success("Trading pair(s) have been blocked!");
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        if (i === pairsToBlock.length - 1) {
          setConfirmBtnLoading(false);
        }
      }
    });
  };

  const handleUnblock = () => {
    const pairsToUnblock = selectedSpotTradingPairs.filter((tp) => tp.status === "Blocked");

    pairsToUnblock.forEach(async (tp, i) => {
      try {
        await api.patch(`/bo/api/markets/${tp.id}/enable`, {
          tradingMode: tp.tradingMode,
          durationInMinutes:
            tp.tradingModeEndDate && tp.tradingModeStartDate
              ? differenceInMinutes(
                  tp.tradingModeEndDate as unknown as Date,
                  tp.tradingModeStartDate as unknown as Date
                )
              : undefined,
        });

        if (i === pairsToUnblock.length - 1) {
          setDialogs([]);
          getSpotTradingPairs();
          toast.success("Trading pair(s) have been unblocked!");
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        if (i === pairsToUnblock.length - 1) {
          setConfirmBtnLoading(false);
        }
      }
    });
  };

  const handleConfirm = () => {
    setConfirmBtnLoading(true);

    if (confirmDialogBtnText === "Confirm") handleCancelOrders();
    else if (confirmDialogBtnText === "Disable") handleDisable();
    else if (confirmDialogBtnText === "Block") handleBlock();
    else handleUnblock();
  };

  const handleAddClick = () => {
    setSpotTradingPair(emptySpotTradingPair);
    setDialogMode("create");
    setDialogs(["spotTradingPair"]);
  };

  const getSpotTradingPairs = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/bo/api/markets/all", params);
      setItems(data.data.items);
      setTotalPages(data.data.totalPages);
      setTotalRecords(data.data.totalRecords);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (allSpotTradingPairsSelected) {
      setSelectedSpotTradingPairs(
        items.map(({ id, state }: { id: number; state: Omit<ISelectedSpotTradingPair, "id"> }) => ({
          id: id,
          status: state.status,
          tradingMode: state.tradingMode,
          tradingModeStartDate: state.tradingModeStartDate,
          tradingModeEndDate: state.tradingModeEndDate,
          isMatchingEnabled: state.isMatchingEnabled,
        }))
      );
    } else {
      setSelectedSpotTradingPairs([]);
    }
  }, [allSpotTradingPairsSelected, items, setSelectedSpotTradingPairs]);

  useEffect(() => {
    if (!checkPermission("markets_list_read")) {
      navigate({ to: "/" });
    } else if (canFetch.current) {
      canFetch.current = false;
      void getSpotTradingPairs();
    }
  }, [checkPermission, navigate, getSpotTradingPairs]);

  return (
    <div>
      <AppToolbar
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        showCancelBtn={showCancelBtn}
        onCancelClick={handleCancelClick}
        showDisableBtn={showDisableBtn}
        onDisableClick={handleDisableClick}
        showBlockBtn={showBlockBtn}
        onBlockClick={handleBlockClick}
        showUnblockBtn={showUnblockBtn}
        onUnblockClick={handleUnblockClick}
        hasCreatePermission={checkPermission("markets_list_create")}
        btnText="Add Spot Trading Pair"
        onAddClick={handleAddClick}
      />

      <FilterBar
        filtersCount={params.filters.length + params.ranges.length}
        loading={filtersLoading}
        serverError={serverError}
        onFilterBtnClick={fetchFilterOptions}
      >
        <SpotTradingPairFiltersForm
          filters={filters}
          coins={coins}
          marketCategories={marketCategories}
          onFilter={handleFilter}
        />
      </FilterBar>

      <TableContainer>
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
      </TableContainer>

      <CreateUpdateDialog title="Spot Trading Pair" dialogType="spotTradingPair">
        <SpotTradingPairForm onSuccess={getSpotTradingPairs} />
      </CreateUpdateDialog>
      <UnsavedChangesDialog />
      <ConfirmDialog
        title={confirmDialogTitle}
        text={confirmDialogText}
        confirmBtnText={confirmDialogBtnText}
        loading={confirmBtnLoading}
        onConfirm={handleConfirm}
      />
      <SpotTradingPairStatusDialog onSuccess={getSpotTradingPairs} />
      <SpotTradingPairMatchingDialog onSuccess={getSpotTradingPairs} />
      <DeleteDialog title="Spot Trading Pair" deleteUrl="markets" onSuccess={getSpotTradingPairs} />
    </div>
  );
};
