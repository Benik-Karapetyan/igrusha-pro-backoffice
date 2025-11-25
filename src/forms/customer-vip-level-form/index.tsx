import { FC, FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import { ISelectItem } from "@types";
import {
  Button,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  ProgressCircular,
  Select,
  Textarea,
} from "@ui-kit";
import { getErrorMessage } from "@utils";

import { CustomerVipLevelFormSchema, CustomerVipLevelFormValues } from "./customer-vip-level-form.consts";

interface CustomerVipLevelFormProps {
  customerVipLevel: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const CustomerVipLevelForm: FC<CustomerVipLevelFormProps> = ({ customerVipLevel, onClose, onSuccess }) => {
  const { id } = useParams({ from: "/auth/customers/$id" });
  const toast = useToast();
  const currentUser = useStore((s) => s.auth.user);
  const defaultValues = useStore((s) => s.customerVipLevel);
  const setDefaultValues = useStore((s) => s.setCustomerVipLevel);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: CustomerVipLevelFormSchema,
    },
    onSubmit: ({ value }) => {
      updateCustomerVipLevel(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const canFetch = useRef(true);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [levels, setLevels] = useState<ISelectItem[]>([]);
  const [newLevelSelected, setNewLevelSelected] = useState(false);
  const [changesApplied, setChangesApplied] = useState(false);

  const handleChange = () => {
    const currentLevelId = form.state.values.levelId;
    const currentLevelName = levels.find((l) => l.id === currentLevelId)?.name;
    if (currentLevelName !== customerVipLevel) setNewLevelSelected(true);
    else setNewLevelSelected(false);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const updateCustomerVipLevel = async (requestData: CustomerVipLevelFormValues) => {
    try {
      setLoading(true);

      await api.patch("/bo/api/customers/set-level", {
        customerId: id,
        levelId: requestData.levelId,
        ...(requestData.note ? { noteRequest: { note: requestData.note, authorEmail: currentUser?.email } } : {}),
      });

      toast.success(`The customer level updated successfully!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const getLevels = useCallback(async () => {
    try {
      const { data } = await api.get("/bo/api/levels/trading-fees/levels?page=1&pageSize=10000");
      setLevels(data.data);
    } catch (err) {
      console.error("Error", err);
    }
  }, []);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getLevels();
    }
  }, [getLevels]);

  useEffect(() => {
    if (levels.length && customerVipLevel) {
      const currentLevel = levels.find((l) => l.name === customerVipLevel);
      if (currentLevel) {
        form.setFieldValue("levelId", (currentLevel as { id: number }).id);
        setLevelsLoading(false);
      }
    }
  }, [levels, customerVipLevel, form, setDefaultValues]);

  return (
    <form onChange={handleChange} onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>Edit Vip Level</DrawerTitle>
      </DrawerHeader>

      {levelsLoading ? (
        <div className="flex h-[calc(100vh_-_8rem)] justify-center p-4 text-primary">
          <ProgressCircular indeterminate />
        </div>
      ) : (
        <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
          {changesApplied && (
            <DrawerDescription asChild>
              <div>
                <p>
                  You are about to update this customer's VIP level from <strong>{customerVipLevel}</strong> to
                  <strong> {levels.find((l) => l.id === form.state.values.levelId)?.name}</strong>. This may impact
                  their trading fee discounts, withdrawal limits, support priority, and other privileges.
                </p>
                <p>Please confirm that this change is intended.</p>
              </div>
            </DrawerDescription>
          )}

          {!changesApplied && (
            <Field name="levelId">
              {({ name, state: { value, meta }, handleChange }) => (
                <Select
                  label="Vip Level"
                  name={name}
                  value={String(value)}
                  items={levels}
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
      )}

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
            disabled={!newLevelSelected}
            onClick={() => setChangesApplied(true)}
          >
            Apply
          </Button>
        )}
      </DrawerFooter>
    </form>
  );
};
