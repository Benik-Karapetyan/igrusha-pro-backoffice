import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, DialogFooter, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { MarketDataFeedFormSchema, MarketDataFeedFormValues } from "./MarketDataFeedForm.consts";

interface MarketDataFeedFormProps {
  onSuccess: () => void;
}

export const MarketDataFeedForm: FC<MarketDataFeedFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogMode = useStore((s) => s.dialogMode);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.marketDataFeed);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: MarketDataFeedFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createMarketDataFeed(value);
      else updateMarketDataFeed(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["marketDataFeed", "unsavedChanges"]);
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

  const createMarketDataFeed = async (requestData: MarketDataFeedFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/marketDataFeeds", requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateMarketDataFeed = async (requestData: MarketDataFeedFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/marketDataFeeds/${requestData.id}`, requestData);
      setDialogs([]);
      toast.success(`${requestData.name} has been updated`);
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
          <Field name="url">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Url"
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
        <Button type="button" variant="outline" className="w-[200px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[200px]" disabled={!canSubmit} loading={loading}>
              {dialogMode === "create" ? "Add Market Data Feed" : "Update Market Data Feed"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
