import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, DialogFooter, TextField } from "@ui-kit";
import { formatScientificToFullNumber, getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { WithdrawNodeFormSchema, WithdrawNodeFormValues } from "./WithdrawNodeForm.consts";

interface WithdrawNodeFormProps {
  onSuccess: () => void;
}

export const WithdrawNodeForm: FC<WithdrawNodeFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.withdrawNode);
  const selectedIds = useStore((s) => s.selectedIds);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: WithdrawNodeFormSchema,
    },
    onSubmit: ({ value }) => {
      withdraw({ ...value, id: selectedIds[0] });
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["vault", "unsavedChanges"]);
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

  const withdraw = async (requestData: WithdrawNodeFormValues) => {
    try {
      setLoading(true);
      await api.put("/bo/api/nodes/withdraw", requestData);
      setDialogs([]);
      toast.success(`Amount has been withdrawn`);
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
      <div className="-mr-2 flex max-h-[calc(100vh_-_15rem)] flex-col gap-1 overflow-auto pl-0.5 pr-2">
        <Field name="address">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              ref={firstInputRef}
              label="Address"
              name={name}
              value={value}
              autoFocus
              errorMessage={meta.errors[0] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </Field>

        <Field name="amount">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              label="Amount"
              name={name}
              value={formatScientificToFullNumber(value)}
              type="number"
              errorMessage={meta.errors[0] || ""}
              onChange={({ target: { value } }) => handleChange(value ? +value : "")}
            />
          )}
        </Field>
      </div>

      <DialogFooter className="gap-4 !pt-4">
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              Withdraw
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
