import { FC, FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { AuditLogDialogMode } from "@containers";
import { useToast } from "@hooks";
import { api } from "@services";
import { useForm } from "@tanstack/react-form";
import { useParams, useSearch } from "@tanstack/react-router";
import { Button, DialogFooter, Select, Textarea, TextField } from "@ui-kit";
import { getErrorMessage } from "@utils";
import { isEqual, omit } from "lodash";

import { IAuditLog } from "../../pages/customer-profile/modules/audit-log/audit-log.types";
import { banReasons, closeReasons } from "../ban-close-customer-form/ban-close-customer-form.consts";
import { AuditLogFormSchema, AuditLogFormValues, AuditLogRequestValues } from "./AuditLogForm.consts";

interface AuditLogFormProps {
  selectedAuditLog: IAuditLog | null;
  defaultValues: AuditLogFormValues;
  mode: AuditLogDialogMode;
  setHasUnsavedChanges: (value: boolean) => void;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuditLogForm: FC<AuditLogFormProps> = ({
  selectedAuditLog,
  defaultValues,
  mode,
  setHasUnsavedChanges,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const { id } = useParams({ from: "/auth/customers/$id" });
  const { auditTab } = useSearch({ from: "/auth/customers/$id" });
  const isDeactivate = useMemo(() => auditTab === "deactivated", [auditTab]);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: AuditLogFormSchema,
    },
    onSubmit: ({ value }) => {
      if (selectedAuditLog) {
        if (mode === "reason" || mode === "jiraLink") {
          updateAuditLog({ ...omit(value, "comment"), comments: selectedAuditLog.comments });
        } else if (mode === "comment") {
          const commentIndex = selectedAuditLog.comments.findIndex((c) => c.id === value.comment.id);
          if (commentIndex === -1)
            updateAuditLog({ ...value, comments: [value.comment, ...selectedAuditLog.comments] });
          else {
            const comments = selectedAuditLog.comments.map((c) => ({ id: c.id, comment: c.comment }));
            comments.splice(commentIndex, 1, value.comment);

            updateAuditLog({ ...value, comments });
          }
        }
      }
    },
  });
  const { Field, Subscribe } = form;
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = () => {
    setHasUnsavedChanges(!isEqual(defaultValues, form.state.values));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const updateAuditLog = async (requestData: AuditLogRequestValues) => {
    try {
      setLoading(true);

      await api.put(`/bo/api/customers/${id}/${auditTab || "blocked"}-audit/${selectedAuditLog?.id}`, requestData);

      toast.success(`Audit Log updated successfully!`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      const input = inputRef.current;
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, []);

  return (
    <form className="flex flex-col gap-8" onChange={handleChange} onSubmit={handleSubmit}>
      <div className="-mr-2 flex max-h-[calc(100vh_-_23rem)] flex-wrap gap-x-5 gap-y-1 overflow-auto pl-0.5 pr-2">
        {mode === "reason" && (
          <div className="w-full">
            <Field name="reason">
              {({ name, state: { value, meta }, handleChange }) => (
                <Select
                  label="Reason *"
                  name={name}
                  value={String(value)}
                  items={isDeactivate ? banReasons : closeReasons}
                  errorMessage={meta.errors[0] || ""}
                  onValueChange={(value) => handleChange(+value)}
                />
              )}
            </Field>
          </div>
        )}

        {mode === "jiraLink" && (
          <div className="w-full">
            <Field name="jiraLink">
              {({ name, state: { value, meta }, handleChange }) => (
                <TextField
                  ref={inputRef}
                  label="Jira link (Optional)"
                  name={name}
                  value={value}
                  autoFocus
                  errorMessage={meta.errors[0] || ""}
                  onChange={(e) => handleChange(e.target.value)}
                />
              )}
            </Field>
          </div>
        )}

        {mode === "comment" && (
          <Field name="comment.comment">
            {({ name, state: { value, meta }, handleChange }) => (
              <Textarea
                ref={textareaRef}
                label="Comment *"
                placeholder="Your comment"
                name={name}
                value={value}
                autoFocus
                className="mb-0.5 h-[201px]"
                errorMessage={meta.errors[0] || ""}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </Field>
        )}
      </div>

      <DialogFooter className="gap-4 !pt-10">
        <Button type="button" variant="outline" className="w-[160px]" onClick={() => onClose()}>
          Cancel
        </Button>
        <Subscribe selector={({ canSubmit }) => [canSubmit]}>
          {([canSubmit]) => (
            <Button type="submit" className="w-[160px]" disabled={!canSubmit} loading={loading}>
              {form.state.values.comment.id === 0 ? "Add" : "Update"}
            </Button>
          )}
        </Subscribe>
      </DialogFooter>
    </form>
  );
};
