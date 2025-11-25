import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, DialogFooter, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { NetworkFormSchema, NetworkFormValues } from "./NetworkForm.consts";

interface NetworkFormProps {
  onSuccess: () => void;
}

export const NetworkForm: FC<NetworkFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.network);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: NetworkFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createNetwork(value);
      else updateNetwork(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["network", "unsavedChanges"]);
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

  const createNetwork = async (requestData: NetworkFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/networks", requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateNetwork = async (requestData: NetworkFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/networks/${requestData.id}`, requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been updated`);
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
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-col gap-1 overflow-auto p-6 pt-3">
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

        <Field name="key">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              label="Key"
              name={name}
              value={value}
              errorMessage={meta.errors[0] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </Field>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Network" : "Update Network"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
