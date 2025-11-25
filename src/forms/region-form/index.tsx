import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, Checkbox, DialogFooter, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { RegionFormSchema, RegionFormValues } from "./RegionForm.consts";

interface RegionFormProps {
  onSuccess: () => void;
}

export const RegionForm: FC<RegionFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.region);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: RegionFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createRegion(value);
      else updateRegion(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["region", "unsavedChanges"]);
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

  const createRegion = async (requestData: RegionFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/locations", { ...requestData, regulated: !!requestData.regulated });
      setDialogs([]);
      toast.success(`${requestData.countryName} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateRegion = async (requestData: RegionFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/locations/${requestData.id}`, { ...requestData, regulated: !!requestData.regulated });
      setDialogs([]);
      toast.success(`${requestData.countryName} has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firstInputRef.current) {
      const input = firstInputRef.current;
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, []);

  return (
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="-mr-2 flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto pl-0.5 pr-2">
        <div className="w-[calc(50%_-_10px)]">
          <Field name="countryName">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                ref={firstInputRef}
                label="Country Name"
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
          <Field name="iso3CountryCode">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="ISO3 Country Code"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="iso3NumericCode">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="ISO3 Numeric Code"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="jurisdiction">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Jurisdiction"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="language">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Language"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="regulatorName">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Regulator Name"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="regulated">
            {({ name, state: { value }, handleChange }) => (
              <Checkbox
                label="Regulated"
                name={name}
                checked={value === 1}
                onCheckedChange={(checked) => {
                  if (checked && value !== 1) handleChange(1);
                  else if (!checked && value !== 0) handleChange(0);
                }}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
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
      </div>

      <DialogFooter className="gap-4 !pt-4">
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? `Add Region` : "Update Region"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
