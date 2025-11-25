import { FC, FormEvent, useEffect, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { TReferralLevel } from "@types";
import { Button, Chip, DrawerFooter, DrawerHeader, DrawerTitle, Icon, TextField } from "@ui-kit";
import { deleteIcon, formatScientificToFullNumber, getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { emptyLevelItem, LevelingSystemFormSchema, LevelSchemaValues } from "./leveling-system-form.consts";

interface LevelingSystemFormProps {
  levels: TReferralLevel[];
  onCancel: () => void;
  onSuccess: () => void;
}

export const LevelingSystemForm: FC<LevelingSystemFormProps> = ({ levels, onCancel, onSuccess }) => {
  const toast = useToast();
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.levelingSystem);
  const setDefaultValues = useStore((s) => s.setLevelingSystem);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: LevelingSystemFormSchema,
    },
    onSubmit: ({ value }) => {
      const minReferredHasError = value.levels.some(
        (level, i, arr) => +level.minReferrals < +arr[i - 1]?.minReferrals + 5
      );
      const rewardHasError = value.levels.some(
        (level, i, arr) => +level.maxCommissionPercent <= +arr[i - 1]?.maxCommissionPercent
      );

      if (!minReferredHasError && !rewardHasError) {
        const levels: (LevelSchemaValues & { maxReferrals: number | null })[] = value.levels.map((level, i, arr) => {
          return {
            ...level,
            maxReferrals: i !== arr.length - 1 ? +arr[i + 1].minReferrals - 1 : null,
            ...(i === 0 ? { minReferrals: 0 } : {}),
          };
        });

        createLevelingSystem(levels);
      }
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);

  const handleClose = () => {
    if (hasUnsavedChanges) setDialogs(["unsavedChanges"]);
    else onCancel();
  };

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createLevelingSystem = async (requestData: (LevelSchemaValues & { maxReferrals: number | null })[]) => {
    try {
      setLoading(true);
      await api.post("/bo/api/userLevels/bulk", requestData);
      toast.success(`Leveling system has been added`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (levels.length) {
      setDefaultValues({ levels });
    }
  }, [levels, setDefaultValues]);

  return (
    <form className="h-full" onChange={handleChange} onSubmit={handleSubmit}>
      <Field name="levels" mode="array">
        {({ state: { value }, pushValue, removeValue }) => (
          <div>
            <DrawerHeader>
              <DrawerTitle>Leveling System</DrawerTitle>

              <Button type="button" variant="outline" size="small" onClick={() => pushValue(emptyLevelItem)}>
                Add Level
              </Button>
            </DrawerHeader>

            <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto bg-background-alt p-4">
              {value.map((_level, i) => (
                <div key={i} className="flex flex-col gap-4 border-b border-dashed border-stroke-medium pb-4">
                  <div className="flex justify-between">
                    <Chip title={`Level ${i + 1}`} />

                    {value.length > 1 && (
                      <Button type="button" variant="ghost" size="iconSmall" onClick={() => removeValue(i)}>
                        <Icon name={deleteIcon} />
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Field name={`levels[${i}].minReferrals`}>
                      {({ name, state: { value: inputValue, meta }, handleChange }) => (
                        <div className="w-1/2 px-3">
                          <TextField
                            label="Min Number of Referred"
                            placeholder="Type"
                            value={i === 0 ? 0 : formatScientificToFullNumber(inputValue)}
                            name={name}
                            type="number"
                            hideDetails
                            dense
                            readOnly={i === 0}
                            errorMessage={
                              typeof inputValue === "number" && inputValue < +value[i - 1]?.minReferrals + 5
                                ? "Min number of referred must be greater by 5 than previous level ones"
                                : meta.errors[0] || ""
                            }
                            onChange={({ target: { value: inputValue } }) => {
                              handleChange(inputValue ? +inputValue : "");
                              form.validateAllFields("change");
                            }}
                          />
                        </div>
                      )}
                    </Field>

                    <Field name={`levels[${i}].maxCommissionPercent`}>
                      {({ name, state: { value: inputValue, meta }, handleChange }) => (
                        <div className="w-1/2 px-3">
                          <TextField
                            label="Referral Reward"
                            placeholder="Type"
                            value={formatScientificToFullNumber(inputValue)}
                            name={name}
                            type="number"
                            hideDetails
                            dense
                            hint="%"
                            errorMessage={
                              typeof inputValue === "number" &&
                              inputValue <= (value[i - 1]?.maxCommissionPercent as number)
                                ? "Referral reward must be greater than previous level ones"
                                : meta.errors[0] || ""
                            }
                            onChange={({ target: { value: inputValue } }) => {
                              handleChange(inputValue ? +inputValue : "");
                              form.validateAllFields("change");
                            }}
                          />
                        </div>
                      )}
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Field>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit} loading={loading} className="w-[60px]">
              Save
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>
    </form>
  );
};
