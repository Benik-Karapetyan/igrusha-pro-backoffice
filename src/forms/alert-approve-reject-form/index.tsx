import { FC, FormEvent, useMemo, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useForm } from "@tanstack/react-form";
import { Button, DrawerFooter, Textarea, Typography } from "@ui-kit";
import { getErrorMessage } from "@utils";

import { AlertApproveRejectFormSchema, AlertApproveRejectFormValues } from "./alert-approve-reject-form.consts";

interface AlertApproveRejectFormProps {
  type: "approve" | "reject";
  transactionId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const AlertApproveRejectForm: FC<AlertApproveRejectFormProps> = ({
  type,
  transactionId,
  onCancel,
  onSuccess,
}) => {
  const toast = useToast();
  const form = useForm({
    defaultValues: {
      notes: "",
    },
    validators: {
      onSubmit: AlertApproveRejectFormSchema,
    },
    onSubmit: ({ value }) => {
      updateTransaction(value);
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);
  const description = useMemo(
    () =>
      type === "approve"
        ? "This confirms that <b>all alerts</b> associated with this transaction have been duly <b>reviewed</b> and <b>addressed</b> in accordance with the established policies. Following this assessment, the transaction will be <b>Approved</b>."
        : "This confirms that <b>all alerts</b> associated with this transaction have been duly <b>reviewed</b> and <b>addressed</b> in accordance with the established policies. Following this assessment, the transaction will be <b>Rejected</b>.",
    [type]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const updateTransaction = async (requestData: AlertApproveRejectFormValues) => {
    try {
      setLoading(true);

      await api.post(`/alerts/api/transactions/${transactionId}/${type}`, {
        ...(type === "approve" ? { notes: requestData.notes } : { reason: requestData.notes }),
      });

      toast.success(`Transaction ${type === "approve" ? "approved" : "rejected"} successfully`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <Typography dangerouslySetInnerHTML={{ __html: description }} />

        <Field name="notes">
          {({ name, state: { value, meta }, handleChange }) => (
            <Textarea
              label="Assessment Summary"
              placeholder="Type"
              name={name}
              value={value}
              required
              errorMessage={meta.errors[0] || ""}
              maxCharacters={1000}
              onChange={(e) => handleChange(e.target.value)}
            />
          )}
        </Field>
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button
              type="submit"
              variant={type === "approve" ? "default" : "critical"}
              disabled={!canSubmit}
              loading={loading}
              className="w-[82px]"
            >
              Confirm
            </Button>
          )}
        </Subscribe>
      </DrawerFooter>
    </form>
  );
};
