import { FC, FormEvent, useState } from "react";

import { RangePickerDialog } from "@containers";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, DrawerFooter, Select, TextField } from "@ui-kit";

import {
  alertCenterOnChainDecisionStatuses,
  alertCenterOnChainRiskLevels,
  AlertCenterOnChainTransactionFiltersFormValues,
  alertCenterOnChainTransactionTypes,
  emptyAlertCenterOnChainTransactionFilters,
} from "./alert-center-on-chain-transaction-filters-form.consts";

interface AlertCenterOnChainTransactionFiltersFormProps {
  filters: AlertCenterOnChainTransactionFiltersFormValues;
  onFilter: (value: AlertCenterOnChainTransactionFiltersFormValues) => void;
}

export const AlertCenterOnChainTransactionFiltersForm: FC<AlertCenterOnChainTransactionFiltersFormProps> = ({
  filters,
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
  const [transactionDateOpen, setTransactionDateOpen] = useState(false);

  const handleReset = () => setDefaultValues(emptyAlertCenterOnChainTransactionFilters);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="flex h-full flex-col" onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <Field name="type">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Transaction Type"
              placeholder="Select"
              name={name}
              value={value ? String(value) : ""}
              items={alertCenterOnChainTransactionTypes}
              hideDetails
              onValueChange={(value) => handleChange(value)}
            />
          )}
        </Field>

        <Field name="riskLevel">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Risk Level"
              placeholder="Select"
              name={name}
              value={value ? String(value) : ""}
              items={alertCenterOnChainRiskLevels}
              hideDetails
              onValueChange={(value) => handleChange(value)}
            />
          )}
        </Field>

        <Field name="status">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Review Result"
              placeholder="Select"
              name={name}
              value={value ? String(value) : ""}
              items={alertCenterOnChainDecisionStatuses}
              hideDetails
              onValueChange={(value) => handleChange(value)}
            />
          )}
        </Field>

        <Field name="transactionDate">
          {({ state: { value }, handleChange }) => (
            <>
              <TextField
                label="Transaction Date"
                placeholder="Select"
                value={value.length ? `${value[0]} - ${value[1]}` : ""}
                readOnly
                hideDetails
                onClick={() => setTransactionDateOpen(true)}
              />

              <RangePickerDialog
                title="Transaction Date"
                open={transactionDateOpen}
                onOpenChange={setTransactionDateOpen}
                value={value}
                onConfirm={(val) => {
                  if (Array.isArray(val)) {
                    handleChange(val);
                    setTransactionDateOpen(false);
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
