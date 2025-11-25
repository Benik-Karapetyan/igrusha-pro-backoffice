import { FC, FormEvent, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import {
  Button,
  Checkbox,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Select,
  Textarea,
  TextField,
} from "@ui-kit";
import { getErrorMessage } from "@utils";

import {
  suspendActions,
  SuspendCustomerFormSchema,
  SuspendCustomerFormValues,
  suspendReasons,
} from "./suspend-customer-form.consts";

interface SuspendCustomerFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const SuspendCustomerForm: FC<SuspendCustomerFormProps> = ({ onClose, onSuccess }) => {
  const { id } = useParams({ from: "/auth/customers/$id" });
  const toast = useToast();
  const customerMainInfo = useStore((s) => s.customerMainInfo);
  const defaultValues = useStore((s) => s.suspendCustomer);
  const form = useForm({
    defaultValues: { ...defaultValues, restrictedActions: customerMainInfo?.restrictedActions || [] },
    validators: {
      onSubmit: SuspendCustomerFormSchema,
    },
    onSubmit: ({ value }) => {
      suspendCustomer(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const suspendCustomer = async (requestData: SuspendCustomerFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/customers/${id}/suspend`, requestData);

      toast.success(`The customer has been suspended successfully!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>Suspend Customer</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <DrawerDescription>
          Are you sure you want to <strong>Suspend</strong> this customer <strong>{customerMainInfo?.fullName}</strong>{" "}
          ?
        </DrawerDescription>

        <Field name="restrictedActions" mode="array">
          {({ state, pushValue, setValue }) => (
            <div className="flex flex-col gap-4">
              <Checkbox
                label="Select All"
                labelBold
                checked={state.value.length === suspendActions.length}
                onCheckedChange={(checked) => {
                  if (checked) setValue(suspendActions.map((a) => a.id));
                  else setValue([]);
                }}
              />

              {suspendActions.map((action, i) => (
                <Checkbox
                  key={i}
                  label={action.name}
                  checked={state.value.includes(action.id)}
                  onCheckedChange={(checked) => {
                    if (checked) pushValue(action.id);
                    else setValue(state.value.filter((id) => id !== action.id));
                  }}
                />
              ))}
            </div>
          )}
        </Field>

        <Field name="reason">
          {({ name, state: { value, meta }, handleChange }) => (
            <Select
              label="Reason"
              placeholder="Select Reason"
              name={name}
              value={String(value)}
              items={suspendReasons}
              hideDetails
              required
              errorMessage={meta.errors[0] || ""}
              onValueChange={(value) => handleChange(+value)}
            />
          )}
        </Field>

        <Field name="jiraLink">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              label="Jira link"
              name={name}
              value={value}
              hideDetails
              errorMessage={meta.errors[0] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </Field>

        <Field name="comment">
          {({ name, state: { value, meta }, handleChange }) => (
            <Textarea
              label="Comment"
              name={name}
              value={value}
              className="mb-0.5 h-[126px]"
              required
              maxCharacters={1000}
              errorMessage={meta.errors[0] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </Field>
      </div>

      <DrawerFooter>
        <Button type="button" variant="outline" className="w-[160px]" onClick={onClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              Confirm
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>
    </form>
  );
};
