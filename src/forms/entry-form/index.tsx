import { FC, FormEvent, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, Calendar, DialogFooter, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";

import { emptyEntry, EntryFormSchema, EntryFormValues } from "./entry-form.consts";

interface EntryFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const EntryForm: FC<EntryFormProps> = ({ onCancel, onSuccess }) => {
  const toast = useToast();
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const selectedEntriesProductId = useStore((s) => s.selectedEntriesProductId);
  const defaultValues = useStore((s) => s.entry) || emptyEntry;
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: EntryFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createEntry(value);
      else updateEntry(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else onCancel();
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createEntry = async (requestData: EntryFormValues) => {
    try {
      setLoading(true);

      await api.post(
        "/entries",
        omit({ ...requestData, productId: selectedEntriesProductId }, requestData.createdAt ? "" : "createdAt")
      );

      toast.success(`Entry has been successfully created!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateEntry = async (requestData: EntryFormValues) => {
    try {
      setLoading(true);

      await api.put(`/entries/${defaultValues?._id}`, {
        ...omit(requestData, "_id", "createdBy"),
        productId: requestData.productId?._id,
      });

      toast.success(`Entry has been successfully updated!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="h-full" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_10rem)] flex-col gap-4 overflow-auto p-6">
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

      <DialogFooter className="flex justify-end gap-4">
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
      </DialogFooter>
    </form>
  );
};
