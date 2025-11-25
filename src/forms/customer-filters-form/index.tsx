import { FC, FormEvent, useState } from "react";

import { RangePickerDialog } from "@containers";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, DrawerFooter, Select, TextField } from "@ui-kit";

import {
  CustomerFiltersFormValues,
  customerStatuses,
  CustomerStatusValues,
  emptyCustomerFilters,
  kycLevels,
  kycStatuses,
} from "./customer-filters-form.consts";

interface CustomerFiltersFormProps {
  filters: CustomerFiltersFormValues;
  kycCountries: ISelectItem[];
  levels: ISelectItem[];
  lastLoginCountries: ISelectItem[];
  onFilter: (value: CustomerFiltersFormValues) => void;
}

export const CustomerFiltersForm: FC<CustomerFiltersFormProps> = ({
  filters,
  kycCountries,
  levels,
  lastLoginCountries,
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
  const [registrationDateOpen, setRegistrationDateOpen] = useState(false);
  const [lastLoginDateOpen, setLastLoginDateOpen] = useState(false);

  const handleReset = () => setDefaultValues(emptyCustomerFilters);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="flex h-full flex-col" onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <Field name="status">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Customer Status"
              name={name}
              value={String(value)}
              items={customerStatuses}
              hideDetails
              onValueChange={(value) => handleChange(+value as CustomerStatusValues)}
            />
          )}
        </Field>

        <Field name="levelId">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Customer Level"
              name={name}
              value={String(value)}
              items={levels}
              hideDetails
              onValueChange={(value) => handleChange(+value)}
            />
          )}
        </Field>

        <Field name="kycStatus">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="KYC Status"
              name={name}
              value={String(value)}
              items={kycStatuses}
              hideDetails
              onValueChange={(value) => handleChange(+value)}
            />
          )}
        </Field>

        <Field name="kycLevel">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="KYC Level"
              name={name}
              value={String(value)}
              items={kycLevels}
              hideDetails
              onValueChange={(value) => handleChange(+value)}
            />
          )}
        </Field>

        <Field name="kycCountry">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="KYC Country"
              name={name}
              value={value}
              items={kycCountries}
              hideDetails
              onValueChange={(value) => handleChange(value)}
            />
          )}
        </Field>

        <Field name="lastLoginCountry">
          {({ name, state: { value }, handleChange }) => (
            <Select
              label="Last Login Country"
              name={name}
              value={value}
              items={lastLoginCountries}
              hideDetails
              onValueChange={(value) => handleChange(value)}
            />
          )}
        </Field>

        <Field name="registrationDate">
          {({ state: { value }, handleChange }) => (
            <>
              <TextField
                label="Registration Date"
                value={value.length ? `${value[0]} - ${value[1]}` : ""}
                readOnly
                hideDetails
                onClick={() => setRegistrationDateOpen(true)}
              />

              <RangePickerDialog
                title="Registration Date"
                open={registrationDateOpen}
                onOpenChange={setRegistrationDateOpen}
                value={value}
                onConfirm={(val) => {
                  if (Array.isArray(val)) {
                    handleChange(val);
                    setRegistrationDateOpen(false);
                  }
                }}
              />
            </>
          )}
        </Field>

        <Field name="lastLoginDate">
          {({ state: { value }, handleChange }) => (
            <>
              <TextField
                label="Last Login Date"
                value={value.length ? `${value[0]} - ${value[1]}` : ""}
                readOnly
                hideDetails
                onClick={() => setLastLoginDateOpen(true)}
              />

              <RangePickerDialog
                title="Last Login Date"
                open={lastLoginDateOpen}
                onOpenChange={setLastLoginDateOpen}
                value={value}
                onConfirm={(val) => {
                  if (Array.isArray(val)) {
                    handleChange(val);
                    setLastLoginDateOpen(false);
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
