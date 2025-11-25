import { FC, FormEvent, useState } from "react";

import { ConfirmTriggerChangeDialog } from "@containers";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { ENUM_VERIFICATION_TRIGGER_TYPE } from "@types";
import { Button, DrawerFooter, DrawerHeader, DrawerTitle, Switch, TextField, Typography } from "@ui-kit";
import { formatScientificToFullNumber, getErrorMessage } from "@utils";
import { isEqual } from "lodash";

import { VerificationTriggersFormSchema, VerificationTriggersFormValues } from "./verification-triggers-form.consts";

interface VerificationTriggersFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const VerificationTriggersForm: FC<VerificationTriggersFormProps> = ({ onCancel, onSuccess }) => {
  const toast = useToast();
  const setDialogs = useStore((s) => s.setDialogs);
  const defaultValues = useStore((s) => s.verificationTriggers);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: VerificationTriggersFormSchema,
    },
    onSubmit: ({ value }) => {
      updateVerificationTriggers(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const hasUnsavedChanges = useStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useStore((s) => s.setHasUnsavedChanges);
  const [amountDisabled, setAmountDisabled] = useState(
    !defaultValues.triggers.find((t) => t.type === ENUM_VERIFICATION_TRIGGER_TYPE.Deposit)?.enabled
  );
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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
    setConfirmDialogOpen(true);
  };

  const updateVerificationTriggers = async (requestData: VerificationTriggersFormValues) => {
    try {
      setLoading(true);
      await api.post("/bo/api/verificationTriggerConfiguration/bulk", [...requestData.triggers]);

      toast.success(`Verification Triggers has been updated successfully!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="h-full" onChange={handleChange} onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>Verification Triggers</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto bg-background-alt p-4">
        <Field name="triggers" mode="array">
          {({ state: { value } }) => (
            <div className="flex flex-col gap-4">
              {value.map((trigger, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Typography variant="body-base" className="grow">
                      {trigger.name}
                    </Typography>

                    <Field name={`triggers[${i}].enabled`}>
                      {({ name, state: { value }, handleChange }) => (
                        <Switch
                          name={name}
                          checked={value}
                          onCheckedChange={(checked) => {
                            if (!checked) form.setFieldValue(`triggers[${i}].amount`, null);
                            setAmountDisabled(!checked);
                            handleChange(checked);
                          }}
                        />
                      )}
                    </Field>
                  </div>

                  {trigger.enabled}

                  {trigger.type === ENUM_VERIFICATION_TRIGGER_TYPE.Deposit && (
                    <Field name={`triggers[${i}].amount`}>
                      {({ name, state: { value }, handleChange }) => (
                        <TextField
                          name={name}
                          value={value ? formatScientificToFullNumber(value) : ""}
                          type="number"
                          label="Total Deposit Amount"
                          placeholder="Type"
                          hint="USD"
                          disabled={amountDisabled}
                          onChange={({ target: { value } }) => handleChange(value ? +value : null)}
                        />
                      )}
                    </Field>
                  )}
                </div>
              ))}
            </div>
          )}
        </Field>
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" disabled={!canSubmit}>
              Save
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>

      <ConfirmTriggerChangeDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        loading={loading}
        onConfirm={() => form.handleSubmit()}
      />
    </form>
  );
};
