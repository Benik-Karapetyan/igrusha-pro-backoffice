import { FC, FormEvent, useEffect, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import { Button, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, Select, Textarea } from "@ui-kit";
import { getErrorMessage } from "@utils";

import {
  CustomerRiskLevelFormSchema,
  CustomerRiskLevelFormValues,
  customerRiskLevels,
} from "./customer-risk-level-form.consts";

interface CustomerRiskLevelFormProps {
  customerRiskLevel: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const CustomerRiskLevelForm: FC<CustomerRiskLevelFormProps> = ({ customerRiskLevel, onClose, onSuccess }) => {
  const { id } = useParams({ from: "/auth/customers/$id" });
  const toast = useToast();
  const currentUser = useStore((s) => s.auth.user);
  const defaultValues = useStore((s) => s.customerRiskLevel);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: CustomerRiskLevelFormSchema,
    },
    onSubmit: ({ value }) => {
      updateCustomerRiskLevel(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const [newRiskLevelSelected, setNewRiskLevelSelected] = useState(false);
  const [changesApplied, setChangesApplied] = useState(false);

  const handleChange = () => {
    const currentRiskLevel = form.state.values.level;
    if (currentRiskLevel !== customerRiskLevel) setNewRiskLevelSelected(true);
    else setNewRiskLevelSelected(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const updateCustomerRiskLevel = async (requestData: CustomerRiskLevelFormValues) => {
    try {
      setLoading(true);

      await api.patch("/bo/api/customers/set-riskLevel", {
        customerId: id,
        level: requestData.level,
        ...(requestData.note ? { noteRequest: { note: requestData.note, authorEmail: currentUser?.email } } : {}),
      });

      toast.success(`The customer risk level has been updated successfully!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerRiskLevel) {
      const currentLevel = customerRiskLevels.find((l) => l.id === customerRiskLevel);
      if (currentLevel) {
        form.setFieldValue("level", (currentLevel as { id: number }).id);
      }
    }
  }, [customerRiskLevel, form]);

  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>Edit Risk Level</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        {changesApplied && (
          <DrawerDescription asChild>
            <div>
              <p>
                You are about to change the risk level for this customer from{" "}
                <strong>{customerRiskLevels.find((rl) => rl.id === customerRiskLevel)?.name || "Not Verified"}</strong>{" "}
                to
                <strong> {customerRiskLevels.find((rl) => rl.id === form.state.values.level)?.name}</strong>. This
                action may affect the user’s transaction limits, monitoring status, and internal compliance workflows.
              </p>
              <p>Please confirm you understand the impact of this change.</p>
            </div>
          </DrawerDescription>
        )}

        {!changesApplied && (
          <Field name="level">
            {({ name, state: { value, meta }, handleChange }) => (
              <Select
                label="Risk Level"
                name={name}
                value={String(value)}
                items={customerRiskLevels}
                hideDetails
                errorMessage={meta.errors[0] || ""}
                onValueChange={(value) => handleChange(+value)}
              />
            )}
          </Field>
        )}

        {changesApplied && (
          <Field name="note">
            {({ name, state: { value, meta }, handleChange }) => (
              <Textarea
                label="Comment"
                placeholder="Type"
                name={name}
                value={value}
                maxCharacters={1000}
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        )}
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        {changesApplied ? (
          <Subscribe selector={({ canSubmit }) => [canSubmit]}>
            {([canSubmit]) => (
              <Button type="submit" className="w-[80px]" disabled={!canSubmit} loading={loading}>
                Confirm
              </Button>
            )}
          </Subscribe>
        ) : (
          <Button
            type="submit"
            className="w-[80px]"
            disabled={!newRiskLevelSelected}
            onClick={() => setChangesApplied(true)}
          >
            Apply
          </Button>
        )}
      </DrawerFooter>
    </form>
  );
};
