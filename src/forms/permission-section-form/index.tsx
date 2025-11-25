import { FC, FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { MultiSelectDialog } from "@containers";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, Checkbox, DialogFooter, MultiSelect, Select, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { PermissionSectionFormSchema, PermissionSectionFormValues } from "./PermissionSectionForm.consts";

interface PermissionSectionFormProps {
  onSuccess: () => void;
}

export const PermissionSectionForm: FC<PermissionSectionFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.permissionSection);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: PermissionSectionFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createPermissionSection(value);
      else updatePermissionSection(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const [permissionSections, setPermissionSections] = useState([]);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["permissionSection", "unsavedChanges"]);
    else setDialogs([]);
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createPermissionSection = async (requestData: PermissionSectionFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/permissionSections", requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updatePermissionSection = async (requestData: PermissionSectionFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/permissionSections/${requestData.id}`, requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getPermissionSections = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/permissionSections/all?page=1&pageSize=10000&status=1");
      setPermissionSections(data.items.map((item: { Name: string }) => ({ ...item, name: item.Name })));
    } catch (err) {
      console.error("Error", err);
    }
  }, []);

  const getPermissions = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/permissions/all?page=1&pageSize=10000&status=1");
      setPermissions(data.items);
    } catch (err) {
      console.error("Error", err);
    }
  }, [setPermissions]);

  useEffect(() => {
    if (firstInputRef.current) {
      const input = firstInputRef.current;
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, []);

  useEffect(() => {
    getPermissions();
    getPermissionSections();
  }, [getPermissions, getPermissionSections]);

  return (
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto px-6 pt-3">
        <div className="w-[calc(50%_-_10px)]">
          <Field name="name">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                ref={firstInputRef}
                label="Name"
                name={name}
                value={value}
                autoFocus
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="permissionIds">
            {({ state: { value, meta }, handleChange }) => (
              <>
                <MultiSelect
                  label="Permission(s)"
                  value={value}
                  items={permissions}
                  errorMessage={meta.errors[0] || ""}
                  onClick={() => setPermissionsOpen(true)}
                />

                <MultiSelectDialog
                  title="Permission(s)"
                  open={permissionsOpen}
                  onOpenChange={setPermissionsOpen}
                  items={permissions}
                  selectedItems={value}
                  onSubmit={(selectedPermissionIds) => {
                    setHasUnsavedChanges(!isEqual(defaultValues.permissionIds, selectedPermissionIds));
                    handleChange(selectedPermissionIds);
                    setPermissionsOpen(false);
                  }}
                />
              </>
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="parentId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Parent Permission Section"
                name={name}
                value={String(value)}
                items={permissionSections}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <Field name="status">
          {({ name, state: { value }, handleChange }) => (
            <Checkbox
              label="Status"
              name={name}
              checked={value === 1}
              onCheckedChange={(checked) => {
                if (checked && value !== 1) handleChange(1);
                else if (!checked && value !== 2) handleChange(2);
              }}
            />
          )}
        </Field>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[220px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[220px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Permission Section" : "Update Permission Section"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
