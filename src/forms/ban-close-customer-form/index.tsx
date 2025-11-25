import { FC, FormEvent, useMemo, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { useForm } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import {
  Button,
  Checkbox,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  Select,
  Textarea,
  TextField,
} from "@ui-kit";
import { cn, getErrorMessage } from "@utils";
import { omit } from "lodash";

import {
  BanCloseCustomerFormSchema,
  BanCloseCustomerFormValues,
  banReasons,
  closeReasons,
} from "./ban-close-customer-form.consts";

interface DeactivateBlockCustomerFormProps {
  onSuccess: () => void;
}

export const BanCloseCustomerForm: FC<DeactivateBlockCustomerFormProps> = ({ onSuccess }) => {
  const { id } = useParams({ from: "/auth/customers/$id" });
  const toast = useToast();
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const isBan = useMemo(() => dialogs.includes("banCustomer"), [dialogs]);
  const customerMainInfo = useStore((s) => s.customerMainInfo);
  const defaultValues = useStore((s) => s.banCloseCustomer);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: BanCloseCustomerFormSchema,
    },
    onSubmit: ({ value }) => {
      if (isBan) banCustomer(value);
      else closeCustomer(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const banCustomer = async (requestData: BanCloseCustomerFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/customers/${id}/ban`, omit(requestData, "confirmOrders", "confirmFunds"));

      setDialogs([]);
      toast.success(`The customer has been banned successfully!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const closeCustomer = async (requestData: BanCloseCustomerFormValues) => {
    try {
      setLoading(true);
      await api.put(`/bo/api/customers/${id}/close`, omit(requestData, "confirmOrders", "confirmFunds"));

      setDialogs([]);
      toast.success(`The customer has been closed successfully!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DrawerHeader>
        <DrawerTitle>{isBan ? "Ban" : "Close"} Customer</DrawerTitle>
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <DrawerDescription>
          Are you sure you want to <strong>{isBan ? "Ban" : "Close"}</strong> this customer{" "}
          <strong>{customerMainInfo?.fullName}</strong> ?
        </DrawerDescription>

        <Field name="reason">
          {({ name, state: { value, meta }, handleChange }) => (
            <Select
              label="Reason"
              placeholder="Select Reason"
              name={name}
              value={String(value)}
              items={isBan ? banReasons : closeReasons}
              hideDetails
              required
              errorMessage={meta.errors[0] || ""}
              onValueChange={(value) => handleChange(+value)}
            />
          )}
        </Field>

        <Field name="jiraLink">
          {({ name, state: { value, meta }, handleChange }) => (
            <TextField
              label="Jira link"
              name={name}
              value={value}
              hideDetails
              errorMessage={meta.errors[0] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </Field>

        <Field name="comment">
          {({ name, state: { value, meta }, handleChange }) => (
            <Textarea
              label="Comment"
              name={name}
              value={value}
              className="mb-0.5 h-[126px]"
              required
              maxCharacters={1000}
              errorMessage={meta.errors[0] || ""}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </Field>

        <Field name="confirmOrders">
          {({ state: { value, meta }, handleChange }) => (
            <div className="flex flex-col gap-1 text-left">
              <div
                className={cn(
                  "flex items-start gap-2 rounded-xl border bg-background p-6",
                  meta.errors[0] && "border-error"
                )}
              >
                <Checkbox
                  checked={value}
                  onCheckedChange={(checked) => {
                    if (checked && !value) handleChange(!!checked);
                    else if (!checked && value) handleChange(!!checked);
                  }}
                />

                <div className="text-sm text-foreground-muted">
                  I can confirm that the customer has no open orders.
                  <span className="text-error-primary"> *</span>
                </div>
              </div>

              {meta.errors[0] && <span className="text-xs text-error-primary">{meta.errors[0]}</span>}
            </div>
          )}
        </Field>

        <Field name="confirmFunds">
          {({ state: { value, meta }, handleChange }) => (
            <div className="flex flex-col gap-1 text-left">
              <div
                className={cn(
                  "flex items-start gap-2 rounded-xl border bg-background p-6",
                  meta.errors[0] && "border-error"
                )}
              >
                <Checkbox
                  checked={value}
                  onCheckedChange={(checked) => {
                    if (checked && !value) handleChange(!!checked);
                    else if (!checked && value) handleChange(!!checked);
                  }}
                />

                <div className="text-sm text-foreground-muted">
                  I can confirm that the customer has no funds in their account.
                  <span className="text-error-primary"> *</span>
                </div>
              </div>

              {meta.errors[0] && <span className="text-xs text-error-primary">{meta.errors[0]}</span>}
            </div>
          )}
        </Field>
      </div>

      <DrawerFooter>
        <Button type="button" variant="outline" className="w-[160px]" onClick={() => setDialogs([])}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              Confirm
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>
    </form>
  );
};
