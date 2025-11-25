import { FC, FormEvent, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, Checkbox, DialogFooter, Select, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual, omit } from "lodash";

import { LevelFormSchema, LevelFormValues, levelTypes, LevelTypeValues } from "./LevelForm.consts";

interface LevelFormProps {
  onSuccess: () => void;
}

export const LevelForm: FC<LevelFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.level);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: LevelFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createLevel(value);
      else updateLevel(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["level", "unsavedChanges"]);
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

  const createLevel = async (requestData: LevelFormValues) => {
    try {
      setLoading(true);
      const { data } = await api.post("/bo/api/levels", omit(requestData, "isDefault"));

      if (requestData.isDefault === 1) await setAsDefaultLevel(data.data.id);

      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateLevel = async (requestData: LevelFormValues) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/bo/api/levels/${requestData.id}`, requestData);

      if (requestData.isDefault === 1) await setAsDefaultLevel(data.data.id);

      setDialogs([]);
      toast.success(`${requestData.name} has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const setAsDefaultLevel = async (id: number) => {
    await api.patch(`/bo/api/levels/${id}/setDefault`);
  };

  return (
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto p-6 pt-3">
        <div className="w-[calc(50%_-_10px)]">
          <Field name="name">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                ref={firstInputRef}
                label="Name"
                name={name}
                value={value}
                autoFocus
                readOnly={dialogMode === "update" && defaultValues.status === 1}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="type">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Type"
                value={String(value)}
                name={name}
                items={levelTypes}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(val) => handleChange(+val as LevelTypeValues)}
              />
            )}
          </Field>
        </div>

        {(dialogMode === "create" || defaultValues.status === 1) && (
          <Field name="isDefault">
            {({ name, state: { value }, handleChange }) => (
              <Checkbox
                label="Set as default"
                name={name}
                checked={value === 1}
                onCheckedChange={(checked) => {
                  if (checked && value !== 1) handleChange(1);
                  else if (!checked && value !== 0) handleChange(0);
                }}
              />
            )}
          </Field>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Level" : "Update Level"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
