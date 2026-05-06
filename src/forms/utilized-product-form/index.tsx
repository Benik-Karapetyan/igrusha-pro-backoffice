import { FC, FormEvent, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, Calendar, DrawerFooter, DrawerHeader, DrawerTitle, Textarea, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";

import { emptyUtilizedProduct, UtilizedProductFormSchema, UtilizedProductFormValues } from "./utilized-product.consts";

interface UtilizedProductFormProps {
  onSuccess: () => void;
}

export const UtilizedProductForm: FC<UtilizedProductFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const dialogMode = useStore((s) => s.dialogMode);
  const setSelectedUtilizedProduct = useStore((s) => s.setSelectedUtilizedProduct);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.selectedUtilizedProduct) || emptyUtilizedProduct;
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: UtilizedProductFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createUtilizedProduct(value);
      else updateUtilizedProduct(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else setSelectedUtilizedProduct(null);
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createUtilizedProduct = async (requestData: UtilizedProductFormValues) => {
    try {
      setLoading(true);

      await api.post("/utilized-products", omit(requestData, requestData.createdAt ? "" : "createdAt"));

      setSelectedUtilizedProduct(null);
      toast.success(`Utilized product has been successfully created!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateUtilizedProduct = async (requestData: UtilizedProductFormValues) => {
    try {
      setLoading(true);

      await api.put(`/utilized-products/${defaultValues._id}`, {
        ...omit(requestData, "_id"),
      });

      setSelectedUtilizedProduct(null);
      toast.success(`Utilized product has been successfully updated!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="h-full" onChange={handleChange} onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>{dialogMode === "create" ? "Create Utilized Product" : "Update Utilized Product"}</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <Field name="note">
          {({ name, state: { value, meta }, handleChange }) => (
            <Textarea
              label="Note"
              placeholder="Enter note"
              name={name}
              value={value}
              errorMessage={meta.errors[0] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </Field>

        <Field name="quantity">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              label="Quantity"
              placeholder="Enter quantity"
              type="number"
              name={name}
              value={value}
              errorMessage={meta.errors[0] || ""}
              onChange={({ target: { value } }) => handleChange(value ? +value : "")}
            />
          )}
        </Field>

        <Field name="createdAt">
          {({ state: { value }, handleChange }) => (
            <Calendar
              label="Created At"
              className="mx-auto"
              value={value}
              onChange={(value) => handleChange(value as string)}
            />
          )}
        </Field>
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[60px]" disabled={!canSubmit} loading={loading}>
              Save
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>
    </form>
  );
};
