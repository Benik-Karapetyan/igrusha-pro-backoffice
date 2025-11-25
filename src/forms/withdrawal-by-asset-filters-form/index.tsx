import { FC, useCallback, useEffect, useRef, useState } from "react";

import { RangePickerDialog } from "@containers";
import { api } from "@services";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Autocomplete, Icon, TextField } from "@ui-kit";
import { calendarIcon } from "@utils";

import {
  emptyWithdrawalByAssetFilters,
  WithdrawalByAssetFiltersFormValues,
} from "./withdrawal-by-asset-filters-form.conts";

interface WithdrawalByAssetFiltersFormProps {
  onChange: (values: WithdrawalByAssetFiltersFormValues) => void;
}

export const WithdrawalByAssetFiltersForm: FC<WithdrawalByAssetFiltersFormProps> = ({ onChange }) => {
  const form = useForm({
    defaultValues: emptyWithdrawalByAssetFilters,
  });
  const { Field } = form;
  const [open, setOpen] = useState(false);
  const [coins, setCoins] = useState<ISelectItem[]>([]);
  const canFetch = useRef(true);

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
      void getCoins();
    }
  }, [getCoins]);

  return (
    <form className="flex items-center gap-4">
      <div className="w-[260px]">
        <Field name="withdrawalDate">
          {({ state: { value }, handleChange }) => (
            <>
              <TextField
                placeholder="DD-MM-YYYY  DD-MM-YYYY"
                value={value.length ? `${value[0]} - ${value[1]}` : ""}
                readOnly
                hideDetails
                appendInner={<Icon name={calendarIcon} />}
                onClick={() => setOpen(true)}
              />

              <RangePickerDialog
                title="Withdrawal Date"
                open={open}
                onOpenChange={setOpen}
                value={value}
                reset
                onConfirm={(val) => {
                  if (Array.isArray(val)) {
                    handleChange(val);
                    setOpen(false);
                    onChange(form.state.values);
                  }
                }}
              />
            </>
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
