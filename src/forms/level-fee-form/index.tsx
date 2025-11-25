import { FC, FormEvent, useCallback, useEffect, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { Button, DrawerFooter, DrawerHeader, DrawerTitle, Select, TableItem, TextField } from "@ui-kit";
import { formatScientificToFullNumber, getErrorMessage } from "@utils";
import { capitalize, isEqual } from "lodash";

import { LevelFeeFormSchema, LevelFeeFormValues } from "./level-fee-form.consts";

interface LevelFeeFormProps {
  onSuccess: () => void;
}

export const LevelFeeForm: FC<LevelFeeFormProps> = ({ onSuccess }) => {
  const toast = useToast();
  const setDialogs = useStore((s) => s.setDialogs);
  const setDrawerOpen = useStore((s) => s.setDrawerOpen);
  const dialogMode = useStore((s) => s.dialogMode);
  const defaultValues = useStore((s) => s.levelFee);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: LevelFeeFormSchema,
    },
    onSubmit: ({ value }) => {
      if (dialogMode === "create") createLevelFee(value);
      else updateLevelFee(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);
  const [levels, setLevels] = useState([]);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else setDrawerOpen(false);
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const getLevels = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/levels/vip?page=1&pageSize=10000");
      setLevels(data.data.filter((l: TableItem) => l.status === 1));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const createLevelFee = async (requestData: LevelFeeFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/fees", requestData);
      toast.success(`Level fee has been successfully created!`);
      setDrawerOpen(false);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const updateLevelFee = async (requestData: LevelFeeFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/fees/${requestData.id}`, requestData);
      toast.success(`Level fee has been successfully updated!`);
      setDrawerOpen(false);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLevels();
  }, [getLevels]);

  return (
    <form className="h-full" onChange={handleChange} onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>{capitalize(dialogMode)} Level Fee</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto bg-background-alt p-4">
        <Field name="levelId">
          {({ name, state: { value, meta }, handleChange }) => (
            <Select
              label="Name"
              placeholder="Type"
              name={name}
              value={value ? String(value) : ""}
              items={levels}
              hideDetails
              errorMessage={meta.errors[0] || ""}
              onValueChange={(val) => handleChange(+val)}
            />
          )}
        </Field>

        <Field name="tradeVolumeIn30Days">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              label="30-Day Trading Volume"
              placeholder="Type"
              value={formatScientificToFullNumber(value)}
              name={name}
              type="number"
              hint="USD"
              hideDetails
              errorMessage={meta.errors[0] || ""}
              onChange={({ target: { value } }) => handleChange(value ? +value : "")}
            />
          )}
        </Field>

        <div className="flex items-start gap-2">
          <Field name="makerFee">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Maker Fee"
                placeholder="Type"
                value={formatScientificToFullNumber(value)}
                name={name}
                type="number"
                hint="%"
                hideDetails
                errorMessage={meta.errors[0] || ""}
                onChange={({ target: { value } }) => handleChange(value ? +value : "")}
              />
            )}
          </Field>

          <Field name="takerFee">
            {({ name, state: { value, meta }, handleChange }) => (
              <TextField
                label="Taker Fee"
                placeholder="Type"
                value={formatScientificToFullNumber(value)}
                name={name}
                type="number"
                hint="%"
                hideDetails
                errorMessage={meta.errors[0] || ""}
                onChange={({ target: { value } }) => handleChange(value ? +value : "")}
              />
            )}
          </Field>
        </div>
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[60px]" disabled={!canSubmit} loading={loading}>
              Save
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>
    </form>
  );
};
