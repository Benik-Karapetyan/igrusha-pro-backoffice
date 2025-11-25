import { FC, FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { MultiSelectDialog } from "@containers";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ISelectItem } from "@types";
import { Button, DialogFooter, MultiSelect, Select, TextField } from "@ui-kit";
import { formatScientificToFullNumber, getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import {
  emptySpotTradingPair,
  SpotTradingPairFormSchema,
  SpotTradingPairFormValues,
} from "./SpotTradingPairForm.consts";

interface SpotTradingPairFormProps {
  onSuccess: () => void;
}

export const SpotTradingPairForm: FC<SpotTradingPairFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.spotTradingPair);
  const setDefaultValues = useStore((s) => s.setSpotTradingPair);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: SpotTradingPairFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createSpotTradingPair(value);
      else updateSpotTradingPair(value);
    },
  });
  const { Field, Subscribe } = form;
  const [coins, setCoins] = useState<ISelectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [marketCategories, setMarketCategories] = useState([]);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const tradingPairName = useMemo(() => {
    return `${coins.find((c) => c.id === form.state.values.firstCoinId)?.symbol}/${coins.find((c) => c.id === form.state.values.secondCoinId)?.symbol}`;
  }, [coins, form.state.values.firstCoinId, form.state.values.secondCoinId]);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["spotTradingPair", "unsavedChanges"]);
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

  const createSpotTradingPair = async (requestData: SpotTradingPairFormValues) => {
    try {
      setLoading(true);
      const firstCoinName = (coins.find((c) => c.id === requestData.firstCoinId)?.name as string) || "";
      const secondCoinName = (coins.find((c) => c.id === requestData.secondCoinId)?.name as string) || "";
      await api.post("/bo/api/markets", {
        ...requestData,
        name: `${firstCoinName.toUpperCase()}/${secondCoinName.toUpperCase()}`,
      });
      setDialogs([]);
      toast.success(`${tradingPairName} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateSpotTradingPair = async (requestData: SpotTradingPairFormValues) => {
    try {
      setLoading(true);
      const firstCoinName = (coins.find((c) => c.id === requestData.firstCoinId)?.name as string) || "";
      const secondCoinName = (coins.find((c) => c.id === requestData.secondCoinId)?.name as string) || "";
      await api.put(`/bo/api/markets/${requestData.id}`, {
        ...requestData,
        name: `${firstCoinName.toUpperCase()}/${secondCoinName.toUpperCase()}`,
      });
      setDialogs([]);
      toast.success(`${tradingPairName} has been updated`);
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
      setCoins(
        data.items
          .filter((item: { status: number }) => item.status === 1)
          .map((item: { symbol: string }) => ({ ...item, name: item.symbol }))
      );
    } catch (err) {
      console.error("Error", err);
    }
  };

  const getMarketCategories = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/marketCategories/all?page=1&pageSize=10000");
      setMarketCategories(data.items.filter((item: { status: number }) => item.status === 1));
    } catch (err) {
      console.error("Error", err);
    }
  }, [setMarketCategories]);

  useEffect(() => {
    if (coins.length && dialogMode === "create") {
      setDefaultValues({ ...emptySpotTradingPair, firstCoinId: +coins[0].id, secondCoinId: +coins[0].id });
      form.reset();
    }
  }, [coins, dialogMode, form, setDefaultValues]);

  useEffect(() => {
    getCoins();
    getMarketCategories();
  }, [getMarketCategories]);

  return (
    <form className="flex flex-col gap-4" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="flex max-h-[calc(100vh_-_15rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto px-6 pt-3">
        <div className="w-[calc(50%_-_10px)]">
          <Field name="firstCoinId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Base Asset"
                name={name}
                value={String(value)}
                items={coins}
                readOnly={dialogMode === "update"}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="secondCoinId">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Quote Asset"
                name={name}
                value={String(value)}
                items={coins}
                readOnly={dialogMode === "update"}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="baseMinAmount">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Base Min Order Amount"
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
          <Field name="baseMaxAmount">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Base Max Order Amount"
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
          <Field name="quoteMinAmount">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Quote Min Order Amount"
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
          <Field name="quoteMaxAmount">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Quote Max Order Amount"
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
          <Field name="priceIncrement">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Min Price Increment"
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
          <Field name="baseAmountIncrement">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Amount Increment"
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
          <Field name="baseAmountPrecision">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Amount Precision"
                name={name}
                value={formatScientificToFullNumber(value)}
                type="number"
                errorMessage={meta.errors[0] || ""}
                onChange={({ target: { value } }) => handleChange(value ? +value.replace(/\D/g, "") : "")}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="pricePrecision">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Price Precision"
                name={name}
                value={formatScientificToFullNumber(value)}
                type="number"
                errorMessage={meta.errors[0] || ""}
                onChange={({ target: { value } }) => handleChange(value ? +value.replace(/\D/g, "") : "")}
              />
            )}
          </Field>
        </div>

        <div className="w-[calc(50%_-_10px)]">
          <Field name="categoriesId">
            {({ state: { value, meta }, handleChange }) => (
              <>
                <MultiSelect
                  label="Category(s)"
                  value={value}
                  items={marketCategories}
                  errorMessage={meta.errors[0] || ""}
                  onClick={() => setCategoriesOpen(true)}
                />

                <MultiSelectDialog
                  title="Category(s)"
                  open={categoriesOpen}
                  onOpenChange={setCategoriesOpen}
                  items={marketCategories}
                  selectedItems={value}
                  onSubmit={(categoriesId) => {
                    setHasUnsavedChanges(!isEqual(defaultValues.categoriesId, categoriesId));
                    handleChange(categoriesId);
                    setCategoriesOpen(false);
                  }}
                />
              </>
            )}
          </Field>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" className="w-[200px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[200px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Spot Trading Pair" : "Update Spot Trading Pair"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
