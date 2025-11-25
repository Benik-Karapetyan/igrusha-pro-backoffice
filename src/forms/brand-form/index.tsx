import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, DialogFooter, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { BrandFormSchema, BrandFormValues } from "./BrandForm.consts";

interface BrandFormProps {
  onSuccess: () => void;
}

export const BrandForm: FC<BrandFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.brand);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: BrandFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createBrand(value);
      else updateBrand(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["brand", "unsavedChanges"]);
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

  const createBrand = async (requestData: BrandFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/brands", requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateBrand = async (requestData: BrandFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/brands/${requestData.id}`, requestData);
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
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-col gap-1 overflow-auto px-6 pt-3">
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

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Brand" : "Update Brand"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
