import { FC, FormEvent, useState } from "react";

import { RangePickerDialog } from "@containers";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, DrawerFooter, Select, TextField } from "@ui-kit";

import {
  emptyOnOffRampHistoryFilters,
  OnOffRampHistoryFiltersFormValues,
  onOffRampHistoryPaymentProviders,
  onOffRampHistoryStatuses,
  onOffRampHistoryTransactionTypes,
} from "./on-off-ramp-history-filters-form.consts";

interface OnOffRampHistoryFiltersFormProps {
  filters: OnOffRampHistoryFiltersFormValues;
  coins: ISelectItem[];
  onFilter: (value: OnOffRampHistoryFiltersFormValues) => void;
}

export const OnOffRampHistoryFiltersForm: FC<OnOffRampHistoryFiltersFormProps> = ({ filters, coins, onFilter }) => {
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

  const handleReset = () => setDefaultValues(emptyOnOffRampHistoryFilters);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="flex h-full flex-col" onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <Field name="transactionType">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Transaction Type"
              name={name}
              value={String(value)}
              items={onOffRampHistoryTransactionTypes}
              hideDetails
              onValueChange={(value) => handleChange(+value)}
            />
          )}
        </Field>

        <Field name="status">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Status"
              name={name}
              value={String(value)}
              items={onOffRampHistoryStatuses}
              hideDetails
              onValueChange={(value) => handleChange(+value)}
            />
          )}
        </Field>

        <Field name="currency">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Crypto Currency"
              name={name}
              value={String(value)}
              items={coins}
              hideDetails
              onValueChange={(value) => handleChange(+value)}
            />
          )}
        </Field>

        <Field name="paymentProviderId">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Payment Provider"
              name={name}
              value={String(value)}
              items={onOffRampHistoryPaymentProviders}
              hideDetails
              onValueChange={(value) => handleChange(+value)}
            />
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
