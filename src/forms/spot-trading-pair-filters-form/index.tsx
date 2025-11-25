import { FC, FormEvent, useState } from "react";

import { MultiSelectDialog, RangePickerDialog } from "@containers";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, DialogFooter, MultiSelect, Select, TextField } from "@ui-kit";

import {
  emptySpotTradingPairFilters,
  SpotTradingPairFiltersFormValues,
  SpotTradingPairFilterStatusValues,
  spotTradingPairStatuses,
} from "./SpotTradingPairFiltersForm.consts";

interface SpotTradingPairFiltersFormProps {
  filters: SpotTradingPairFiltersFormValues;
  coins: ISelectItem[];
  marketCategories: ISelectItem[];
  onFilter: (value: SpotTradingPairFiltersFormValues) => void;
}

export const SpotTradingPairFiltersForm: FC<SpotTradingPairFiltersFormProps> = ({
  filters,
  coins,
  marketCategories,
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
  const [marketCategoriesOpen, setMarketCategoriesOpen] = useState(false);
  const [createdAtOpen, setCreatedAtOpen] = useState(false);
  const [updatedAtOpen, setUpdatedAtOpen] = useState(false);

  const handleReset = () => setDefaultValues(emptySpotTradingPairFilters);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto p-6 pb-0 pt-3">
        <div className="w-[calc(50%_-_10px)]">
          <Field name="baseAsset">
            {({ name, state: { value }, handleChange }) => (
              <Select
                label="Base Asset"
                name={name}
                value={String(value)}
                items={coins}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="quoteAsset">
            {({ name, state: { value }, handleChange }) => (
              <Select
                label="Quote Asset"
                name={name}
                value={String(value)}
                items={coins}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="status">
            {({ name, state: { value }, handleChange }) => (
              <Select
                label="Status"
                name={name}
                value={String(value)}
                items={spotTradingPairStatuses}
                onValueChange={(value) => handleChange(+value as SpotTradingPairFilterStatusValues)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="categories">
            {({ state: { value }, handleChange }) => (
              <>
                <MultiSelect
                  label="Category"
                  value={value}
                  items={marketCategories}
                  onClick={() => setMarketCategoriesOpen(true)}
                />

                <MultiSelectDialog
                  title="Category"
                  open={marketCategoriesOpen}
                  onOpenChange={setMarketCategoriesOpen}
                  items={marketCategories}
                  selectedItems={value}
                  onSubmit={(selectedRoles) => {
                    handleChange(selectedRoles);
                    setMarketCategoriesOpen(false);
                  }}
                />
              </>
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="createdAt">
            {({ state: { value }, handleChange }) => (
              <>
                <TextField
                  label="Created At"
                  value={value.length ? `${value[0]} - ${value[1]}` : ""}
                  readOnly
                  onClick={() => setCreatedAtOpen(true)}
                />

                <RangePickerDialog
                  title="Created At"
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

        <div className="w-[calc(50%_-_10px)]">
          <Field name="updatedAt">
            {({ state: { value }, handleChange }) => (
              <>
                <TextField
                  label="Updated At"
                  value={value.length ? `${value[0]} - ${value[1]}` : ""}
                  readOnly
                  onClick={() => setUpdatedAtOpen(true)}
                />

                <RangePickerDialog
                  title="Updated At"
                  open={updatedAtOpen}
                  onOpenChange={setUpdatedAtOpen}
                  value={value}
                  onConfirm={(val) => {
                    if (Array.isArray(val)) {
                      handleChange(val);
                      setUpdatedAtOpen(false);
                    }
                  }}
                />
              </>
            )}
          </Field>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleReset}>
          Reset
        </Button>

        <Button type="submit" className="w-[160px]">
          Filter
        </Button>
      </DialogFooter>
    </form>
  );
};
