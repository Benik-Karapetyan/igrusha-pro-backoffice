import { FC, FormEvent, useState } from "react";

import { RangePickerDialog } from "@containers";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Autocomplete, Button, DrawerFooter, TextField } from "@ui-kit";

import { emptyTradingHistoryFilters, TradingHistoryFiltersFormValues } from "./TradingHistoryFiltersForm.consts";

interface TradingHistoryFiltersFormProps {
  filters: TradingHistoryFiltersFormValues;
  tradingPairs: ISelectItem[];
  onFilter: (value: TradingHistoryFiltersFormValues) => void;
}

export const TradingHistoryFiltersForm: FC<TradingHistoryFiltersFormProps> = ({ filters, tradingPairs, onFilter }) => {
  const setDialogs = useStore((s) => s.setDialogs);
  const [defaultValues, setDefaultValues] = useState(filters);
  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      onFilter(value);
      setDialogs([]);
    },
  });
  const { Field } = form;
  const [createdAtOpen, setCreatedAtOpen] = useState(false);

  const handleReset = () => setDefaultValues(emptyTradingHistoryFilters);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="flex h-full flex-col" onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <Field name="marketSymbolPairs">
          {({ state: { value }, handleChange }) => (
            <Autocomplete label="Trading Pairs" selectedItems={value} items={tradingPairs} onChange={handleChange} />
          )}
        </Field>

        <Field name="createdAt">
          {({ state: { value }, handleChange }) => (
            <>
              <TextField
                label="Creation Date"
                value={value.length ? `${value[0]} - ${value[1]}` : ""}
                readOnly
                hideDetails
                onClick={() => setCreatedAtOpen(true)}
              />

              <RangePickerDialog
                title="Creation Date"
                open={createdAtOpen}
                onOpenChange={setCreatedAtOpen}
                value={value}
                onConfirm={(val) => {
                  if (Array.isArray(val)) {
                    handleChange(val);
                    setCreatedAtOpen(false);
                  }
                }}
              />
            </>
          )}
        </Field>
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={() => setDialogs([])}>
          Cancel
        </Button>

        <Button type="button" variant="outline" onClick={handleReset}>
          Reset
        </Button>

        <Button type="submit">Apply</Button>
      </DrawerFooter>
    </form>
  );
};
