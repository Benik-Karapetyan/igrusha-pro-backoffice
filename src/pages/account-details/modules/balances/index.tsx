import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AccountsTableContainer, AppDrawer, ConfirmTransferDialog, UnsavedChangesDialog } from "@containers";
import { AssetTransferForm } from "@forms";
import { api } from "@services";
import { useStore } from "@store";
import { useParams } from "@tanstack/react-router";
import { TAccount, TAccountBalance, TBalanceItem } from "@types";
import { DataTable, Icon, TextField } from "@ui-kit";
import { searchIcon } from "@utils";

import { useBalanceHeaders } from "./hooks/useBalanceHeaders";

export const Balances = () => {
  const { type } = useParams({ from: "/auth/accounts/$type/$id" });
  const drawerOpen = useStore((s) => s.drawerOpen);
  const setDrawerOpen = useStore((s) => s.setDrawerOpen);
  const { headers } = useBalanceHeaders();
  const [searchValue, setSearchValue] = useState("");
  const canFetch = useRef(true);
  const canFetchAccounts = useRef(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [accounts, setAccounts] = useState<TAccount[]>([]);
  const filteredItems = useMemo(
    () =>
      searchValue
        ? items.filter((item: { assetId: string }) => item.assetId.toLowerCase().includes(searchValue.toLowerCase()))
        : items,
    [searchValue, items]
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const calculateTotalBalances = (balances: TBalanceItem[]) => {
    let baseTotal = 0;
    let quoteTotal = 0;

    balances.forEach((balance) => {
      baseTotal += balance.base.amount;
      if (balance.quote) quoteTotal += balance.quote.amount;
    });

    return {
      base: {
        currency: balances[0].base.currency,
        amount: baseTotal,
      },
      quote: {
        currency: balances[0].quote?.currency,
        amount: quoteTotal,
      },
    };
  };

  const getItems = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/fin/api/balances`, { params: { type } });

      setItems(
        data.data.map((item: TAccountBalance) => ({
          ...item,
          totalBalance: { ...calculateTotalBalances(item.balances) },
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  const getAccounts = useCallback(async () => {
    try {
      const { data } = await api.get(`/fin/api/accounts`);
      setAccounts(data.data.map((account: TAccount) => ({ ...account, id: account.type })));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getItems();
    }
  }, [getItems]);

  useEffect(() => {
    if (canFetchAccounts.current) {
      canFetchAccounts.current = false;
      getAccounts();
    }
  }, [getAccounts]);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[240px]">
        <TextField
          value={searchValue}
          placeholder="Search by Assets"
          hideDetails
          prependInner={<Icon name={searchIcon} className="mr-2" />}
          onChange={handleSearchChange}
        />
      </div>

      <AccountsTableContainer>
        <div className="overflow-auto">
          <DataTable headers={headers} items={filteredItems} loading={loading} hideFooter />
        </div>
      </AccountsTableContainer>

      <AppDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <AssetTransferForm accounts={accounts} />
      </AppDrawer>

      <ConfirmTransferDialog accounts={accounts} onSuccess={getItems} />

      <UnsavedChangesDialog />
    </div>
  );
};
