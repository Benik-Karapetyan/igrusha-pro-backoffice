import { FC, FormEvent, useState } from "react";

import { MultiSelectDialog, RangePickerDialog } from "@containers";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, DialogFooter, MultiSelect, Select, TextField } from "@ui-kit";

import {
  AdminUserFiltersFormValues,
  adminUserStatuses,
  AdminUserStatusValues,
  emptyAdminUserFilters,
} from "./AdminUserFiltersForm.consts";

interface AdminUserFiltersFormProps {
  filters: AdminUserFiltersFormValues;
  roles: ISelectItem[];
  orgLevels: ISelectItem[];
  brands: ISelectItem[];
  onFilter: (value: AdminUserFiltersFormValues) => void;
}

export const AdminUserFiltersForm: FC<AdminUserFiltersFormProps> = ({
  filters,
  roles,
  orgLevels,
  brands,
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
  const [rolesOpen, setRolesOpen] = useState(false);
  const [orgLevelsOpen, setOrgLevelsOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [createdDateOpen, setCreatedDateOpen] = useState(false);
  const [modifiedDateOpen, setModifiedDateOpen] = useState(false);
  const [lastLoginDateOpen, setLastLoginDateOpen] = useState(false);

  const handleReset = () => setDefaultValues(emptyAdminUserFilters);

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
                items={adminUserStatuses}
                onValueChange={(value) => handleChange(+value as AdminUserStatusValues)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="roles">
            {({ state: { value }, handleChange }) => (
              <>
                <MultiSelect label="Role(s)" value={value} items={roles} onClick={() => setRolesOpen(true)} />

                <MultiSelectDialog
                  title="Role(s)"
                  open={rolesOpen}
                  onOpenChange={setRolesOpen}
                  items={roles}
                  selectedItems={value}
                  onSubmit={(selectedRoles) => {
                    handleChange(selectedRoles);
                    setRolesOpen(false);
                  }}
                />
              </>
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="orgLevels">
            {({ state: { value }, handleChange }) => (
              <>
                <MultiSelect
                  label="Org Level(s)"
                  value={value}
                  items={orgLevels}
                  onClick={() => setOrgLevelsOpen(true)}
                />

                <MultiSelectDialog
                  title="Org Level(s)"
                  open={orgLevelsOpen}
                  onOpenChange={setOrgLevelsOpen}
                  items={orgLevels}
                  selectedItems={value}
                  onSubmit={(selectedRoles) => {
                    handleChange(selectedRoles);
                    setOrgLevelsOpen(false);
                  }}
                />
              </>
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="brands">
            {({ state: { value }, handleChange }) => (
              <>
                <MultiSelect label="Brand(s)" value={value} items={brands} onClick={() => setBrandsOpen(true)} />

                <MultiSelectDialog
                  title="Brand(s)"
                  open={brandsOpen}
                  onOpenChange={setBrandsOpen}
                  items={brands}
                  selectedItems={value}
                  onSubmit={(selectedRoles) => {
                    handleChange(selectedRoles);
                    setBrandsOpen(false);
                  }}
                />
              </>
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
          <Field name="lastLoginDate">
            {({ state: { value }, handleChange }) => (
              <>
                <TextField
                  label="Last Login Date"
                  value={value.length ? `${value[0]} - ${value[1]}` : ""}
                  readOnly
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
