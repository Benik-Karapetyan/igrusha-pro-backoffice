import { FC, FormEvent, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useForm } from "@tanstack/react-form";
import { Button, DrawerFooter, DrawerHeader, DrawerTitle, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";

import { apiKeyFormSchema, ApiKeyFormValues } from "./api-key-form.consts.ts";

interface ApiKeyFormProps {
  onSuccess: (rps: number) => void;
  onCancel: () => void;
  defaultValues?: ApiKeyFormValues;
}

export const ApiKeyForm: FC<ApiKeyFormProps> = ({ onSuccess, onCancel, defaultValues }) => {
  const toast = useToast();
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: apiKeyFormSchema,
    },
    onSubmit: ({ value }) => {
      updateRps(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const updateRps = async (requestData: ApiKeyFormValues) => {
    try {
      setLoading(true);
      await api.put("/bo/api/accessCredentials", requestData);
      toast.success("RPS has been updated successfully.");
      onSuccess(requestData.newRPS);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex h-full flex-col" onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>RPS Settings</DrawerTitle>
      </DrawerHeader>

      <div className="p-4">
        <Field name="newRPS">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              label="Requests Per Second"
              name={name}
              value={value}
              type="number"
              placeholder="RPS"
              errorMessage={meta.errors[0] || ""}
              onChange={(e) => handleChange(Number(e.target.value))}
            />
          )}
        </Field>
      </div>

      <DrawerFooter className="mt-auto">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit} loading={loading}>
              Save
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>
    </form>
  );
};
