import { FC, useEffect, useRef, useState } from "react";

import { api } from "@services";
import { Autocomplete, Icon, TextField } from "@ui-kit";
import { searchIcon } from "@utils";

import { transactionOrderTypes } from "../transaction.consts";

interface TransactionsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  assetIds: string[];
  onAssetIdsChange: (value: string[]) => void;
  transactionTypes: string[];
  onTransactionTypesChange: (value: string[]) => void;
}

export const TransactionsToolbar: FC<TransactionsToolbarProps> = ({
  searchValue,
  onSearchChange,
  assetIds,
  onAssetIdsChange,
  transactionTypes,
  onTransactionTypesChange,
}) => {
  const canFetch = useRef(true);
  const [coins, setCoins] = useState([]);

  const getCoins = async () => {
    try {
      const { data } = await api.get("/bo/api/coins/all?page=1&pageSize=1000");
      setCoins(
        data.items
          .filter((item: { status: number }) => item.status === 1)
          .map((item: { symbol: string }) => ({
            ...item,
            id: item.symbol,
          }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getCoins();
    }
  }, []);

  return (
    <div className="flex justify-between">
      <div className="w-[240px]">
        <TextField
          value={searchValue}
          placeholder="Search by Assets"
          hideDetails
          prependInner={<Icon name={searchIcon} className="mr-2" />}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        <div className="w-[240px]">
          <Autocomplete placeholder="Assets" selectedItems={assetIds} items={coins} onChange={onAssetIdsChange} />
        </div>

        <div className="w-[240px]">
          <Autocomplete
            placeholder="Transaction Type"
            selectedItems={transactionTypes}
            items={transactionOrderTypes}
            onChange={onTransactionTypesChange}
          />
        </div>
      </div>
    </div>
  );
};
