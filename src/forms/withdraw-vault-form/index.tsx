import { FC, FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, DialogFooter, Select, TextField } from "@ui-kit";
import { formatScientificToFullNumber, getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { WithdrawVaultFormSchema, WithdrawVaultFormValues } from "./WithdrawVaultForm.consts";

interface WithdrawVaultFormProps {
  onSuccess: () => void;
}

export const WithdrawVaultForm: FC<WithdrawVaultFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.withdrawVault);
  const selectedIds = useStore((s) => s.selectedIds);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: WithdrawVaultFormSchema,
    },
    onSubmit: ({ value }) => {
      withdraw(value);
    },
  });
  const { Field, Subscribe } = form;
  const [assets, setAssets] = useState([]);
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

  const withdraw = async (requestData: WithdrawVaultFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/vaults/withdraw/${selectedIds[0]}`, requestData);
      setDialogs([]);
      toast.success(`Amount has been withdrawn`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getAssets = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/assets/all?pageSize=10000");
      setAssets(data.items);
    } catch (err) {
      console.error("Error", err);
    }
  }, []);

  useEffect(() => {
    if (firstInputRef.current) {
      const input = firstInputRef.current;
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, []);

  useEffect(() => {
    getAssets();
  }, [getAssets]);

  return (
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="-mr-2 flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto pl-0.5 pr-2">
        <div className="w-[calc(50%_-_10px)]">
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
        </div>

        <div className="w-[calc(50%_-_10px)]">
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

        <div className="w-[calc(50%_-_10px)]">
          <Field name="seedPhrase">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Seed Phrase"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="assetId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Asset"
                name={name}
                value={String(value)}
                items={assets}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>
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
