import { FC, FormEvent, useState } from "react";

import { RangePickerDialog } from "@containers";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Autocomplete, Button, DrawerFooter, Icon, TextField } from "@ui-kit";
import { calendarIcon } from "@utils";

import {
  emptyOnChainTransactionFilters,
  OnChainTransactionFiltersFormValues,
  onChainTransactionStatuses,
  riskLevels,
  transactionTypes,
} from "./on-chain-transaction-filters-form.consts.ts";

interface OnChainTransactionFiltersFormProps {
  filters: OnChainTransactionFiltersFormValues;
  networks: ISelectItem[];
  coins: ISelectItem[];
  onFilter: (value: OnChainTransactionFiltersFormValues) => void;
}

export const OnChainTransactionFiltersForm: FC<OnChainTransactionFiltersFormProps> = ({
  filters,
  networks,
  coins,
  onFilter,
}) => {
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
  const [creationDateOpen, setCreationDateOpen] = useState(false);

  const handleReset = () => setDefaultValues(emptyOnChainTransactionFilters);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="flex h-full flex-col" onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <Field name="types">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              label="Transaction Type"
              placeholder="Select"
              selectedItems={value}
              items={transactionTypes}
              hasSearch={false}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field name="network">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              label="Network"
              placeholder="Select"
              selectedItems={value}
              items={networks}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field name="assetSymbols">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              label="Assets"
              placeholder="Select"
              selectedItems={value}
              items={coins}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field name="riskLevel">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              label="Risk Level"
              placeholder="Select"
              selectedItems={value}
              items={riskLevels}
              hasSearch={false}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field name="status">
          {({ state: { value }, handleChange }) => (
            <Autocomplete
              label="Status"
              placeholder="Select"
              selectedItems={value}
              items={onChainTransactionStatuses}
              hasSearch={false}
              onChange={handleChange}
            />
          )}
        </Field>

        <Field name="creationDate">
          {({ state: { value }, handleChange }) => (
            <>
              <TextField
                label="Creation Date"
                placeholder="Select"
                value={value.length ? `${value[0]} - ${value[1]}` : ""}
                readOnly
                hideDetails
                appendInner={<Icon name={calendarIcon} />}
                onClick={() => setCreationDateOpen(true)}
              />

              <RangePickerDialog
                title="Registration Date"
                open={creationDateOpen}
                onOpenChange={setCreationDateOpen}
                value={value}
                onConfirm={(val) => {
                  if (Array.isArray(val)) {
                    handleChange(val);
                    setCreationDateOpen(false);
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
