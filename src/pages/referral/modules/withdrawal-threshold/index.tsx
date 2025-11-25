import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AppDrawer, UnsavedChangesDialog } from "@containers";
import { WithdrawalThresholdsForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { TReferralAsset } from "@types";
import { DataTable, Icon, Switch, TextField } from "@ui-kit";
import { searchIcon } from "@utils";

import { TableContainer } from "../../table-container";
import { useWithdrawalThresholdHeaders } from "./hooks/useWithdrawalThresholdHeaders";

interface WithdrawalThresholdProps {
  drawerOpen: boolean;
  onDrawerOpenChange: (open: boolean) => void;
}

export const WithdrawalThreshold: FC<WithdrawalThresholdProps> = ({ drawerOpen, onDrawerOpenChange }) => {
  const setDialogs = useStore((s) => s.setDialogs);
  const { headers } = useWithdrawalThresholdHeaders();
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TReferralAsset[]>([]);
  const [initialItems, setInitialItems] = useState<TReferralAsset[]>([]);
  const [showDefaults, setShowDefaults] = useState(false);
  const filteredItems = useMemo(() => {
    let filteredItems: TReferralAsset[] = [...items];

    if (showDefaults) filteredItems = items.filter((item) => item.amount === 0);

    return searchValue
      ? filteredItems.filter((item) => item.coin.symbol.toLowerCase().includes(searchValue.toLowerCase()))
      : filteredItems;
  }, [showDefaults, searchValue, items]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const uniqueBySymbol = (arr: TReferralAsset[]) => {
    const seen = new Set();
    return arr.filter((item) => {
      const symbol = item.coin?.symbol;
      if (seen.has(symbol)) return false;
      seen.add(symbol);
      return true;
    });
  };

  const getWithdrawalThresholds = useCallback(async () => {
    try {
      setLoading(true);

      const { data: assetsData } = await api.get(`/bo/api/assets/all`, { params: { page: 1, pageSize: 100 } });
      const { data: thresholdsData } = await api.get(`/bo/api/thresholds/all`, { params: { page: 1, pageSize: 100 } });
      setInitialItems(assetsData.items);
      const uniqueAssets = uniqueBySymbol(assetsData.items);
      setItems(
        uniqueAssets.map((item: TReferralAsset) => {
          return {
            ...item,
            amount: thresholdsData.items.find((td: { assetId: number }) => td.assetId === item.id)?.amount || 0,
          };
        })
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getWithdrawalThresholds();
    }
  }, [getWithdrawalThresholds]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="w-[240px]">
          <TextField
            value={searchValue}
            placeholder="Search by Assets"
            hideDetails
            prependInner={<Icon name={searchIcon} className="mr-2" />}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <Switch checked={showDefaults} label="Show Default:" labelSide="left" onCheckedChange={setShowDefaults} />
      </div>

      <TableContainer>
        <div className="overflow-auto">
          <DataTable headers={headers} items={filteredItems} loading={loading} hideFooter />
        </div>
      </TableContainer>

      <AppDrawer open={drawerOpen} onOpenChange={onDrawerOpenChange} size="lg">
        <WithdrawalThresholdsForm
          initialAssets={initialItems}
          assets={filteredItems}
          onCancel={() => onDrawerOpenChange(false)}
          onSuccess={() => {
            onDrawerOpenChange(false);
            getWithdrawalThresholds();
          }}
        />
      </AppDrawer>

      <UnsavedChangesDialog
        onConfirm={() => {
          setDialogs([]);
          onDrawerOpenChange(false);
        }}
      />
    </div>
  );
};
