import { FC, FormEvent, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ENUM_CATEGORY_TYPE } from "@types";
import { Autocomplete, Button, DrawerFooter, DrawerHeader, DrawerTitle, Textarea, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual, omit } from "lodash";

import { CategoryFormSchema, CategoryFormValues, categoryTypes } from "./category-form.consts";

interface CategoryFormProps {
  onSuccess: () => void;
}

export const CategoryForm: FC<CategoryFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const dialogMode = useStore((s) => s.dialogMode);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.category);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: CategoryFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createCategory(value);
      else updateCategory(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else setDrawerType(null);
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createCategory = async (requestData: CategoryFormValues) => {
    try {
      setLoading(true);

      await api.post("/categories", requestData);

      setDrawerType(null);
      toast.success("Category has been successfully created!");
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (requestData: CategoryFormValues) => {
    try {
      setLoading(true);

      await api.put(`/categories/${defaultValues._id}`, omit(requestData, "_id"));

      setDrawerType(null);
      toast.success("Category has been successfully updated!");
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
        <DrawerTitle>{dialogMode === "create" ? "Create Category" : "Update Category"}</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4 pb-80">
        <div className="flex gap-4">
          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="type">
              {({ state: { value, meta }, handleChange }) => (
                <Autocomplete
                  label="Category Type"
                  placeholder="Select category type"
                  selectedItems={value}
                  items={categoryTypes}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(value) => handleChange(value as ENUM_CATEGORY_TYPE[])}
                />
              )}
            </Field>
          </div>

          <div className="w-[calc(100%_/_3_-_0.68rem)]">
            <Field name="urlName">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="URL Name"
                  placeholder="Enter URL name"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="grow">
            <Field name="name.am">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Name (Armenian)"
                  placeholder="Enter name"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="name.ru">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Name (Russian)"
                  placeholder="Enter name"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="name.en">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Name (English)"
                  placeholder="Enter name"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="grow">
            <Field name="title.am">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Title (Armenian)"
                  placeholder="Enter title"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="title.ru">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Title (Russian)"
                  placeholder="Enter title"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="title.en">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Title (English)"
                  placeholder="Enter title"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="grow">
            <Field name="description.am">
              {({ name, state: { value, meta }, handleChange }) => (
                <Textarea
                  label="Description (Armenian)"
                  placeholder="Enter description"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="description.ru">
              {({ name, state: { value, meta }, handleChange }) => (
                <Textarea
                  label="Description (Russian)"
                  placeholder="Enter description"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>

          <div className="grow">
            <Field name="description.en">
              {({ name, state: { value, meta }, handleChange }) => (
                <Textarea
                  label="Description (English)"
                  placeholder="Enter description"
                  name={name}
                  value={value}
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>
        </div>
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
