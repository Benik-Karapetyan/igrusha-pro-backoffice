import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, DialogFooter, Select, TextField } from "@ui-kit";
import { formatScientificToFullNumber, getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { AssetFormSchema, AssetFormValues, emptyAsset, types } from "./AssetForm.consts";

interface AssetFormProps {
  onSuccess: () => void;
}

export const AssetForm: FC<AssetFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.asset);
  const setDefaultValues = useStore((s) => s.setAsset);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: AssetFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createAsset(value);
      else updateAsset(value);
    },
  });
  const { Field, Subscribe } = form;
  const [networks, setNetworks] = useState<ISelectItem[]>([]);
  const [coins, setCoins] = useState<ISelectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["asset", "unsavedChanges"]);
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

  const createAsset = async (requestData: AssetFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/assets", requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateAsset = async (requestData: AssetFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/assets/${requestData.id}`, requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
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

  const getCoins = async () => {
    try {
      const { data } = await api.get("/bo/api/coins/all?page=1&pageSize=10000");
      setCoins(data.items.filter((item: { status: number }) => item.status === 1));
    } catch (err) {
      console.error("Error", err);
    }
  };

  useEffect(() => {
    if (firstInputRef.current) {
      const input = firstInputRef.current;
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }, []);

  useEffect(() => {
    if (networks.length && coins.length && dialogMode === "create") {
      setDefaultValues({ ...emptyAsset, networkId: +networks[0].id, coinId: +coins[0].id });
      form.reset();
    }
  }, [networks, coins, dialogMode, form, setDefaultValues]);

  useEffect(() => {
    getNetworks();
    getCoins();
  }, []);

  return (
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto px-6 pt-3">
        <div className="w-[calc(50%_-_10px)]">
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
        </div>

        <div className="w-[calc(50%_-_10px)]">
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
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="networkId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Network"
                name={name}
                value={String(value)}
                items={networks}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="coinId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Coin"
                name={name}
                value={String(value)}
                items={coins}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="type">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Type"
                name={name}
                value={String(value)}
                items={types}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="contractSupply">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Contract Supply"
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
          <Field name="contractName">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Contract Name"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="contractSymbol">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Contract Symbol"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="contractAddress">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Contract Address"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="contractDeployerAddress">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Contract Deployer Address"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="contractAbi">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Contract ABI"
                name={name}
                value={value}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Asset" : "Update Asset"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
