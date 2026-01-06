import { FC, FormEvent, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ENUM_EXPENSE_TYPE } from "@types";
import { Button, Calendar, DrawerFooter, DrawerHeader, DrawerTitle, Select, Textarea, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual, omit } from "lodash";

import { ExpenseFormSchema, ExpenseFormValues, expenseTypes } from "./expense-form.consts";

interface ExpenseFormProps {
  onSuccess: () => void;
}

export const ExpenseForm: FC<ExpenseFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const dialogMode = useStore((s) => s.dialogMode);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.expense);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ExpenseFormSchema,
    },
    onSubmit: ({ value }) => {
      console.log("Value", value);
      if (dialogMode === "create") createExpense(value);
      else updateExpense(value);
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

  const createExpense = async (requestData: ExpenseFormValues) => {
    try {
      setLoading(true);

      await api.post("/expenses", omit(requestData, requestData.createdAt ? "" : "createdAt"));

      setDrawerType(null);
      toast.success(`Expense has been successfully created!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (requestData: ExpenseFormValues) => {
    try {
      setLoading(true);

      await api.put(`/expenses/${defaultValues._id}`, {
        ...omit(requestData, "_id"),
      });

      setDrawerType(null);
      toast.success(`Expense has been successfully updated!`);
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
        <DrawerTitle>{dialogMode === "create" ? "Create Expense" : "Update Expense"}</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <Field name="type">
          {({ name, state: { value, meta }, handleChange }) => (
            <Select
              label="Type"
              placeholder="Select type"
              name={name}
              value={value}
              items={expenseTypes}
              errorMessage={meta.errors[0] || ""}
              onValueChange={(value) => handleChange(value as ENUM_EXPENSE_TYPE)}
            />
          )}
        </Field>

        <Field name="description">
          {({ name, state: { value, meta }, handleChange }) => (
            <Textarea
              label="Description"
              placeholder="Enter description"
              name={name}
              value={value}
              errorMessage={meta.errors[0] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </Field>

        <Field name="amount">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              label="Amount"
              placeholder="Enter amount"
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
