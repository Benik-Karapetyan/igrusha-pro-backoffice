import { FC, FormEvent, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, Checkbox, DialogFooter, Select, TextField } from "@ui-kit";
import { formatScientificToFullNumber, getErrorMessage } from "@utils";
import { isEqual, omit, pick } from "lodash";

import {
  SpotTradingPairStatusFormSchema,
  SpotTradingPairStatusFormValues,
  tradingModesActive,
  tradingModesPreActive,
} from "./SpotTradingPairStatusForm.consts";

interface SpotTradingPairStatusFormProps {
  onSuccess: () => void;
}

export const SpotTradingPairStatusForm: FC<SpotTradingPairStatusFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.spotTradingPairStatus);
  const setDefaultValues = useStore((s) => s.setSpotTradingPairStatus);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: SpotTradingPairStatusFormSchema,
    },
    onSubmit: ({ value }) => {
      updateStatus(value);
    },
  });
  const { Field, Subscribe } = form;
  const enabled = useStore((s) => s.selectedElementEnabled);
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["spotTradingPairStatus", "unsavedChanges"]);
    else setDialogs([]);
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));

    if (form.state.values.tradingMode === "FullTrading") {
      setDefaultValues({ ...omit(form.state.values, "durationInMinutes") });
      form.reset();
    } else {
      if (!("durationInMinutes" in form.state.values)) {
        setDefaultValues({ ...form.state.values, durationInMinutes: "" });
        form.reset();
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (enabled) updateStatus();
    else form.handleSubmit();
  };

  const updateStatus = async (requestData?: SpotTradingPairStatusFormValues) => {
    try {
      setLoading(true);

      await api.patch(
        `/bo/api/markets/${defaultValues.id}/${enabled ? "disable" : "enable"}`,
        requestData ? pick(requestData, "tradingMode", "durationInMinutes", "enableMatching") : undefined
      );

      setDialogs([]);
      toast.success(`Spot trading pair has been updated`);
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
      {!enabled && (
        <div className="-mr-2 flex max-h-[calc(100vh_-_15rem)] flex-col gap-1 overflow-auto pl-0.5 pr-2">
          <Field name="tradingMode">
            {({ name, state: { value, meta } }) => (
              <Select
                label="Select Activation Mode"
                name={name}
                value={String(value)}
                items={defaultValues.status === "Inactive" ? tradingModesPreActive : tradingModesActive}
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => {
                  if (value === "PostOnly") {
                    setDefaultValues({ ...form.state.values, tradingMode: value, enableMatching: false });
                  } else {
                    setDefaultValues({ ...form.state.values, tradingMode: value, enableMatching: true });
                  }

                  form.reset();
                }}
              />
            )}
          </Field>

          {form.state.values.tradingMode !== "FullTrading" && (
            <Field name="durationInMinutes">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  label="Select Mode Duration (Minutes)"
                  name={name}
                  value={formatScientificToFullNumber(value)}
                  type="number"
                  errorMessage={meta.errors[0] || ""}
                  onChange={({ target: { value } }) => handleChange(value ? +value : "")}
                />
              )}
            </Field>
          )}

          <Field name="enableMatching">
            {({ name, state: { value }, handleChange }) => (
              <Checkbox
                label="Enable Matching"
                name={name}
                checked={value}
                onCheckedChange={(checked) => handleChange(!!checked)}
              />
            )}
          </Field>
        </div>
      )}

      <DialogFooter className="gap-4 !pt-4">
        <Button type="button" variant="outline" className="w-[160px]" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              {enabled ? "Deactivate" : defaultValues.status === "Inactive" ? "Activate" : "Change"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
