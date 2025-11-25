import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, DialogFooter, TextField } from "@ui-kit";
import { formatScientificToFullNumber, getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import {
  WithdrawalDepositSettingFormSchema,
  WithdrawalDepositSettingFormValues,
} from "./WithdrawalDepositSettingForm.consts";

interface WithdrawalDepositSettingFormProps {
  onSuccess: () => void;
}

export const WithdrawalDepositSettingForm: FC<WithdrawalDepositSettingFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.withdrawalDepositSetting);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: WithdrawalDepositSettingFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "update") updateWithdrawalDepositSetting(value);
    },
  });
  const { Field, Subscribe } = form;
  const [coins, setCoins] = useState<ISelectItem[]>([]);
  const [networks, setNetworks] = useState<ISelectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["withdrawalDepositSetting", "unsavedChanges"]);
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

  const updateWithdrawalDepositSetting = async (requestData: WithdrawalDepositSettingFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/assetTransactionSettings/${requestData.id}`, requestData);
      setDialogs([]);
      toast.success(`Withdraw Deposit Setting has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getCoins = async () => {
    try {
      const { data } = await api.get("/bo/api/coins/all?page=1&pageSize=10000");
      setCoins(data.items.filter((item: { status: number }) => item.status === 1));
    } catch (err) {
      console.error("Error", err);
    }
  };

  const getNetworks = async () => {
    try {
      const { data } = await api.get("/bo/api/networks/all?page=1&pageSize=10000");
      setNetworks(data.filter((item: { status: number }) => item.status === 1));
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => {
    getCoins();
    getNetworks();
  }, []);

  return (
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto px-6 pt-3">
        <div className="w-[calc(50%_-_10px)]">
          <Field name="coinId">
            {({ state: { value } }) => (
              <TextField
                ref={firstInputRef}
                label="Coin"
                value={coins?.find((c) => c.id === value)?.name || ""}
                disabled
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="networkId">
            {({ state: { value } }) => (
              <TextField
                ref={firstInputRef}
                label="Network"
                value={networks?.find((c) => c.id === value)?.name || ""}
                disabled
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="minDeposit">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                ref={firstInputRef}
                label="Min Deposit"
                type="number"
                name={name}
                value={formatScientificToFullNumber(value)}
                autoFocus
                errorMessage={meta.errors[0] || ""}
                onChange={({ target: { value } }) => handleChange(value ? +value : "")}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="minWithdrawal">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Min Withdrawal"
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
          <Field name="maxWithdrawal">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Max Withdrawal"
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
          <Field name="withdrawalFee">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Withdrawal Fee"
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
          <Field name="depositFee">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Deposit Fee"
                name={name}
                value={formatScientificToFullNumber(value)}
                type="number"
                errorMessage={meta.errors[0] || ""}
                onChange={({ target: { value } }) => handleChange(value ? +value : "")}
              />
            )}
          </Field>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[230px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[280px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Withdrawal & Deposit Settings" : "Update Withdrawal & Deposit Settings"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
