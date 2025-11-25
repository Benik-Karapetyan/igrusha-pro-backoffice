import { FC, FormEvent, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useForm } from "@tanstack/react-form";
import { Button, Icon, TextField } from "@ui-kit";
import { getErrorMessage, sendIcon } from "@utils";

import { OnOffRampNoteFormSchema, OnOffRampNoteFormValues } from "./on-off-ramp-note-form.consts";

interface OnOffRampNoteFormProps {
  orderId: number;
  authorEmail: string;
  onSuccess: () => void;
}

export const OnOffRampNoteForm: FC<OnOffRampNoteFormProps> = ({ orderId, authorEmail, onSuccess }) => {
  const toast = useToast();
  const form = useForm({
    defaultValues: {
      orderId,
      note: "",
      authorEmail,
    },
    validators: {
      onSubmit: OnOffRampNoteFormSchema,
    },
    onSubmit: ({ value }) => {
      createNote(value);
      form.setFieldValue("note", "");
    },
  });
  const { Field, Subscribe } = form;
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const createNote = async (requestData: OnOffRampNoteFormValues) => {
    try {
      setLoading(true);

      await api.post(`/bo/api/payment/order/note`, requestData);

      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field name="note">
        {({ name, state: { value, meta }, handleChange }) => (
          <TextField
            key="comment"
            placeholder="Type a note"
            name={name}
            value={value}
            hideDetails
            errorMessage={meta.errors[0] || ""}
            appendInner={
              <Subscribe selector={({ canSubmit }) => [canSubmit]}>
                {([canSubmit]) => (
                  <Button type="submit" variant="default" size="iconSmall" disabled={!canSubmit} loading={loading}>
                    <Icon name={sendIcon} color="current" />
                  </Button>
                )}
              </Subscribe>
            }
            onChange={(e) => handleChange(e.target.value)}
          />
        )}
      </Field>
    </form>
  );
};
