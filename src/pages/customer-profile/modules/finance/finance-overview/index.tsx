import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { api } from "@services";
import { useParams } from "@tanstack/react-router";
import { ICustomerAccount, ISelectItem } from "@types";
import { Autocomplete, Icon, TextField } from "@ui-kit";
import { searchIcon } from "@utils";

import { AccountsOverview } from "./accounts-overview";
import { Assets } from "./assets";
import { Balance } from "./balance";
import { accountTypes } from "./finance-overview.consts";

export const FinanceOverview = () => {
  const { id } = useParams({ from: "/auth/customers/$id" });
  const [searchValue, setSearchValue] = useState("");
  const canSetAssets = useRef(true);
  const [filterAssets, setFilterAssets] = useState<ISelectItem[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedBalanceTypes, setSelectedBalanceTypes] = useState<number[]>([]);
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [spotAccount, setSpotAccount] = useState<ICustomerAccount>();
  const [fundingAccount, setFundingAccount] = useState<ICustomerAccount>();
  const [assets, setAssets] = useState<ICustomerAccount[]>([]);

  const filteredAssets = useMemo(() => {
    return searchValue
      ? assets.filter((asset) => asset.assetId.toLowerCase().includes(searchValue.toLowerCase()))
      : assets;
  }, [assets, searchValue]);

  const balanceAmount = useMemo(
    () => (spotAccount && fundingAccount ? spotAccount.total.equivalent + fundingAccount.total.equivalent : 0),
    [spotAccount, fundingAccount]
  );

  const balanceCurrency = useMemo(
    () => spotAccount?.total.equivalentAssetId || fundingAccount?.total.equivalentAssetId || "",
    [fundingAccount?.total.equivalentAssetId, spotAccount?.total.equivalentAssetId]
  );

  const handleAssetsChange = (assets: string[]) => {
    setSelectedAssets(assets);
    canFetch.current = true;
  };

  const handleBalanceTypesChange = (balanceTypes: number[]) => {
    setSelectedBalanceTypes(balanceTypes);
    canFetch.current = true;
  };

  const getAccounts = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      selectedAssets.forEach((assetId) => params.append("assetIds", assetId));
      selectedBalanceTypes
        .map((type) => type - 1)
        .forEach((accountType) => params.append("accountTypes", String(accountType)));

      const { data } = await api.get(`/bo/api/customers/${id}/accounts`, { params });

      const tradingAccounts = data.accounts.filter((a: ICustomerAccount) => a.type === "Trading");
      if (tradingAccounts.length > 0) {
        const combinedTradingAccount: ICustomerAccount = {
          ...tradingAccounts[0],
          total: {
            equivalent: tradingAccounts.reduce((sum: number, acc: ICustomerAccount) => sum + acc.total.equivalent, 0),
            equivalentAssetId: tradingAccounts[0].total.equivalentAssetId,
          },
        };
        setSpotAccount(combinedTradingAccount);
      } else {
        setSpotAccount({
          type: "Trading",
          assetId: "USD",
          available: {
            amount: 0,
            equivalent: 0,
            equivalentAssetId: "USD",
          },
          locked: { amount: 0, equivalent: 0, equivalentAssetId: "USD" },
          total: { amount: 0, equivalent: 0, equivalentAssetId: "USD" },
        });
      }

      const fundingAccounts = data.accounts.filter((a: ICustomerAccount) => a.type === "Funding");
      if (fundingAccounts.length > 0) {
        const combinedFundingAccount: ICustomerAccount = {
          ...fundingAccounts[0],
          total: {
            equivalent: fundingAccounts.reduce((sum: number, acc: ICustomerAccount) => sum + acc.total.equivalent, 0),
            equivalentAssetId: fundingAccounts[0].total.equivalentAssetId,
          },
        };
        setFundingAccount(combinedFundingAccount);
      } else {
        setFundingAccount({
          type: "Trading",
          assetId: "USD",
          available: {
            amount: 0,
            equivalent: 0,
            equivalentAssetId: "USD",
          },
          locked: { amount: 0, equivalent: 0, equivalentAssetId: "USD" },
          total: { amount: 0, equivalent: 0, equivalentAssetId: "USD" },
        });
      }

      const assets = Object.values(
        data.accounts.reduce((acc: Record<string, ICustomerAccount>, account: ICustomerAccount) => {
          const key = account.assetId;
          if (!acc[key]) {
            acc[key] = {
              ...account,
              available: { ...account.available, amount: 0, equivalent: 0 },
              locked: { ...account.locked, amount: 0, equivalent: 0 },
              total: { ...account.total, amount: 0, equivalent: 0 },
            };
          }
          acc[key].available.amount += account.available.amount;
          acc[key].available.equivalent += account.available.equivalent;
          acc[key].locked.amount += account.locked.amount;
          acc[key].locked.equivalent += account.locked.equivalent;
          acc[key].total.amount += account.total.amount;
          acc[key].total.equivalent += account.total.equivalent;

          return acc;
        }, [])
      ) as ICustomerAccount[];

      setAssets(assets);

      if (canSetAssets.current) {
        canSetAssets.current = false;
        setFilterAssets(assets.map((asset) => ({ name: asset.assetId, id: asset.assetId })));
      }
    } catch (err) {
      setServerError(!!err);
    } finally {
      setLoading(false);
    }
  }, [id, selectedAssets, selectedBalanceTypes]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getAccounts();
    }
  }, [getAccounts]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <Balance amount={balanceAmount} currency={balanceCurrency} loading={loading} isError={serverError} />

        <AccountsOverview
          spotAccount={spotAccount}
          fundingAccount={fundingAccount}
          loading={loading}
          isError={serverError}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="w-[240px]">
            <TextField
              value={searchValue}
              placeholder="Search by Assets"
              className="mr-2"
              hideDetails
              prependInner={<Icon name={searchIcon} />}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="w-[240px]">
              <Autocomplete
                placeholder="Assets"
                selectedItems={selectedAssets}
                items={filterAssets}
                hasSearch={false}
                onChange={handleAssetsChange}
              />
            </div>

            <div className="w-[240px]">
              <Autocomplete
                placeholder="Account Types"
                selectedItems={selectedBalanceTypes}
                items={accountTypes}
                hasSearch={false}
                onChange={handleBalanceTypesChange}
              />
            </div>
          </div>
        </div>

        <Assets loading={loading} items={filteredAssets} serverError={serverError} />
      </div>
    </div>
  );
};
