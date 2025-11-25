import { FC, useCallback, useEffect, useRef, useState } from "react";

import { api } from "@services";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Autocomplete } from "@ui-kit";

import { DepositNetworkFiltersFormValues, emptyDepositNetworkFilters } from "./deposit-network-filters-form.consts";

interface DepositNetworkFiltersFormProps {
  onChange: (values: DepositNetworkFiltersFormValues) => void;
}

export const DepositNetworkFiltersForm: FC<DepositNetworkFiltersFormProps> = ({ onChange }) => {
  const form = useForm({
    defaultValues: emptyDepositNetworkFilters,
  });
  const { Field } = form;
  const [networks, setNetworks] = useState<ISelectItem[]>([]);
  const [coins, setCoins] = useState<ISelectItem[]>([]);
  const canFetch = useRef(true);

  const getNetworks = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/networks/all?page=1&pageSize=10000");
      setNetworks(
        data
          .filter((item: { status: number }) => item.status === 1)
          .map((item: { name: string }) => ({
            ...item,
            id: item.name,
          }))
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getCoins = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/coins/all?page=1&pageSize=10000");
      setCoins(
        data.items
          .filter((item: { status: number }) => item.status === 1)
          .map((item: { symbol: string }) => ({
            ...item,
            name: item.symbol,
            id: item.symbol,
          }))
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getNetworks();
      void getCoins();
    }
  }, [getNetworks, getCoins]);

  return (
    <form className="flex items-center gap-4">
      <div className="w-[240px]">
        <Field name="networks">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              placeholder="Networks"
              selectedItems={value}
              items={networks}
              onChange={(val) => {
                handleChange(val);
                onChange(form.state.values);
              }}
            />
          )}
        </Field>
      </div>

      <div className="w-[240px]">
        <Field name="assetIds">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              placeholder="Assets"
              selectedItems={value}
              items={coins}
              onChange={(val) => {
                handleChange(val);
                onChange(form.state.values);
              }}
            />
          )}
        </Field>
      </div>
    </form>
  );
};
