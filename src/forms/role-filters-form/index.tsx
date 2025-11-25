import { FC, FormEvent, useState } from "react";

import { RangePickerDialog } from "@containers";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, DialogFooter, Select, TextField } from "@ui-kit";
import { formatScientificToFullNumber } from "@utils";

import { emptyRoleFilters, RoleFiltersFormValues, roleStatuses, RoleStatusValues } from "./RoleFiltersForm.consts";

interface RoleFiltersFormProps {
  filters: RoleFiltersFormValues;
  modifiedByItems: ISelectItem[];
  onFilter: (value: RoleFiltersFormValues) => void;
}

export const RoleFiltersForm: FC<RoleFiltersFormProps> = ({ filters, modifiedByItems, onFilter }) => {
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
  const [createdDateOpen, setCreatedDateOpen] = useState(false);
  const [modifiedDateOpen, setModifiedDateOpen] = useState(false);

  const handleReset = () => setDefaultValues(emptyRoleFilters);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto p-6 pb-0 pt-3">
        <div className="w-[calc(50%_-_10px)]">
          <Field name="status">
            {({ name, state: { value }, handleChange }) => (
              <Select
                label="Status"
                name={name}
                value={String(value)}
                items={roleStatuses}
                onValueChange={(value) => handleChange(+value as RoleStatusValues)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="createdDate">
            {({ state: { value }, handleChange }) => (
              <>
                <TextField
                  label="Created Date"
                  value={value.length ? `${value[0]} - ${value[1]}` : ""}
                  readOnly
                  onClick={() => setCreatedDateOpen(true)}
                />

                <RangePickerDialog
                  title="Created Date"
                  open={createdDateOpen}
                  onOpenChange={setCreatedDateOpen}
                  value={value}
                  onConfirm={(val) => {
                    if (Array.isArray(val)) {
                      handleChange(val);
                      setCreatedDateOpen(false);
                    }
                  }}
                />
              </>
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="modifiedDate">
            {({ state: { value }, handleChange }) => (
              <>
                <TextField
                  label="Modified Date"
                  value={value.length ? `${value[0]} - ${value[1]}` : ""}
                  readOnly
                  onClick={() => setModifiedDateOpen(true)}
                />

                <RangePickerDialog
                  title="Modified Date"
                  open={modifiedDateOpen}
                  onOpenChange={setModifiedDateOpen}
                  value={value}
                  onConfirm={(val) => {
                    if (Array.isArray(val)) {
                      handleChange(val);
                      setModifiedDateOpen(false);
                    }
                  }}
                />
              </>
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="modifiedBy">
            {({ name, state: { value }, handleChange }) => (
              <Select
                label="Modified By"
                name={name}
                value={value}
                items={modifiedByItems}
                onValueChange={(value) => handleChange(value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="userCountMin">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="User Count Min"
                name={name}
                value={formatScientificToFullNumber(value)}
                type="number"
                errorMessage={meta.errors[0] || ""}
                onChange={({ target: { value } }) => handleChange(value ? +value.replace(/\D/g, "") : "")}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="userCountMax">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="User Count Max"
                name={name}
                value={formatScientificToFullNumber(value)}
                type="number"
                errorMessage={meta.errors[0] || ""}
                onChange={({ target: { value } }) => handleChange(value ? +value.replace(/\D/g, "") : "")}
              />
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
