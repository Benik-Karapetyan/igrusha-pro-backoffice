import { FC, FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { MultiSelectDialog } from "@containers";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, Checkbox, DialogFooter, MultiSelect, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { SmsProviderFormSchema, SmsProviderFormValues } from "./SmsProviderForm.consts";

interface SmsProviderFormProps {
  onSuccess: () => void;
}

export const SmsProviderForm: FC<SmsProviderFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.smsProvider);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: SmsProviderFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createSmsProvider(value);
      else updateSmsProvider(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);
  const [regions, setRegions] = useState([]);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["smsProvider", "unsavedChanges"]);
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

  const createSmsProvider = async (requestData: SmsProviderFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/smsProviders", requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateSmsProvider = async (requestData: SmsProviderFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/smsProviders/${requestData.id}`, requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getRegions = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/locations/all?page=1&pageSize=10000");
      setRegions(data.items.map((item: { countryName: string }) => ({ ...item, name: item.countryName })));
    } catch (err) {
      console.error("Error", err);
    }
  }, [setRegions]);

  useEffect(() => {
    if (firstInputRef.current) {
      const input = firstInputRef.current;
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, []);

  useEffect(() => {
    getRegions();
  }, [getRegions]);

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
          <Field name="description">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Description"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="locationIds">
            {({ state: { value, meta }, handleChange }) => (
              <>
                <MultiSelect
                  label="Regions(s)"
                  value={value}
                  items={regions}
                  errorMessage={meta.errors[0] || ""}
                  onClick={() => setRegionsOpen(true)}
                />

                <MultiSelectDialog
                  title="Regions(s)"
                  open={regionsOpen}
                  onOpenChange={setRegionsOpen}
                  items={regions}
                  selectedItems={value}
                  onSubmit={(locationIds) => {
                    setHasUnsavedChanges(!isEqual(defaultValues.locationIds, locationIds));
                    handleChange(locationIds);
                    setRegionsOpen(false);
                  }}
                />
              </>
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
        <Button type="button" variant="outline" className="w-[180px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[180px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Sms Provider" : "Update Sms Provider"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
