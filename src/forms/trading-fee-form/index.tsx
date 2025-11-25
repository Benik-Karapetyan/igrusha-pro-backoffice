import { FC, FormEvent, useEffect, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, Checkbox, DialogFooter, Select, TextField } from "@ui-kit";
import { formatScientificToFullNumber, getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { emptyTradingFee, TradingFeeFormSchema, TradingFeeFormValues } from "./TradingFeeForm.consts";

interface FeeFormProps {
  onSuccess: () => void;
}

export const TradingFeeForm: FC<FeeFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.tradingFee);
  const setDefaultValues = useStore((s) => s.setTradingFee);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: TradingFeeFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createTradingFee(value);
      else updateTradingFee(value);
    },
  });
  const { Field, Subscribe } = form;
  const [regions, setRegions] = useState<ISelectItem[]>([]);
  const [levels, setLevels] = useState<ISelectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["tradingFee", "unsavedChanges"]);
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

  const createTradingFee = async (requestData: TradingFeeFormValues) => {
    try {
      setLoading(true);
      const { data } = await api.post("/bo/api/fees", { ...requestData, tradingProductType: 1 });

      if (requestData.isDefault === 1) await setAsDefaultTradingFee(data.id);

      setDialogs([]);
      toast.success(`Trading Fee has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateTradingFee = async (requestData: TradingFeeFormValues) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/bo/api/fees/${requestData.id}`, requestData);

      if (requestData.isDefault === 1) await setAsDefaultTradingFee(data.id);

      setDialogs([]);
      toast.success(`Trading Fee has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getRegions = async () => {
    try {
      const { data } = await api.get("/bo/api/locations/all?page=1&pageSize=10000");
      setRegions(data.items.map((item: ISelectItem) => ({ ...item, name: item.countryName })));
    } catch (err) {
      console.error("Error", err);
    }
  };

  const getLevels = async () => {
    try {
      const { data } = await api.get("/bo/api/levels/all?page=1&pageSize=10000");
      setLevels(data.data.items.filter((item: { status: number }) => item.status === 1));
    } catch (err) {
      console.error("Error", err);
    }
  };

  const setAsDefaultTradingFee = async (id: number) => {
    await api.patch(`/bo/api/fees/${id}/setDefault`);
  };

  useEffect(() => {
    if (dialogMode === "create" && regions.length && levels.length) {
      const regionId = regions.find((r) => r.name === "Global")?.id;
      const levelId = levels.find((l) => l.isDefault)?.id;
      if (typeof regionId === "number" && typeof levelId === "number")
        setDefaultValues({ ...emptyTradingFee, regionId, levelId });
    }
  }, [dialogMode, regions, levels, setDefaultValues]);

  useEffect(() => {
    getRegions();
    getLevels();
  }, []);

  return (
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto p-6 pt-3">
        <div className="w-[calc(50%_-_10px)]">
          <Field name="regionId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Region"
                name={name}
                value={String(value)}
                items={regions}
                readOnly
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="levelId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Level"
                name={name}
                value={String(value)}
                items={levels}
                readOnly={dialogMode === "update"}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="makerFee">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Maker Fee"
                name={name}
                value={formatScientificToFullNumber(value)}
                type="number"
                step="0.01"
                autoFocus
                errorMessage={meta.errors[0] || ""}
                onChange={({ target: { value } }) => {
                  handleChange(value ? +value : "");
                }}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="takerFee">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Taker Fee"
                name={name}
                value={formatScientificToFullNumber(value)}
                type="number"
                step="0.01"
                errorMessage={meta.errors[0] || ""}
                onChange={({ target: { value } }) => handleChange(value ? +value : "")}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="tradeVolumeIn30Days">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Trade Volume in Last 30 Days"
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
          <Field name="key">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Key"
                name={name}
                value={value}
                readOnly={dialogMode === "update"}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        </div>

        {(dialogMode === "create" || defaultValues.status === 1) && (
          <Field name="isDefault">
            {({ name, state: { value }, handleChange }) => (
              <Checkbox
                label="Set as default"
                name={name}
                checked={value === 1}
                onCheckedChange={(checked) => {
                  if (checked && value !== 1) handleChange(1);
                  else if (!checked && value !== 0) handleChange(0);
                }}
              />
            )}
          </Field>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[180px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[180px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Trading Fee" : "Update Trading Fee"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
