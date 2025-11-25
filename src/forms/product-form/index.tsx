import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, Checkbox, DialogFooter, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { ProductFormSchema, ProductFormValues } from "./product-form.consts";

interface ProductFormProps {
  onSuccess: () => void;
}

export const ProductForm: FC<ProductFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.product);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ProductFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createProduct(value);
      else updateProduct(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["product", "unsavedChanges"]);
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

  const createProduct = async (requestData: ProductFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/products", requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (requestData: ProductFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/products/${requestData.id}`, requestData);
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
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Product" : "Update Product"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
