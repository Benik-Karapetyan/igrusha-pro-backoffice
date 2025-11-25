import { FormEvent, useMemo, useState } from "react";

import { AlertRuleConfirmDialog } from "@containers";
import { useToast } from "@hooks";
import { api } from "@services";
import { IAlertRule } from "@types";
import { Button, Icon, Typography } from "@ui-kit";
import { checkedIcon, closeIcon, getErrorMessage } from "@utils";

import { AlertRuleFormField } from "./alert-rule-form-field";

interface AlertRuleFormProps {
  rule: IAlertRule;
  onCancel: () => void;
  onSuccess: () => void;
}

export const AlertRuleForm = ({ rule, onCancel, onSuccess }: AlertRuleFormProps) => {
  const toast = useToast();
  const [forms, setForms] = useState(Object.assign({}, rule.conditionForm, rule.resultForm));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const hasError = useMemo(() => {
    return Object.values(forms).some((form) => !form.value || +form.value < 0);
  }, [forms]);
  const descriptionTemplate = useMemo(() => {
    return rule.descriptionTemplate?.startsWith("If") ? rule.descriptionTemplate : `If ${rule.descriptionTemplate}`;
  }, [rule.descriptionTemplate]);

  const handleChange = (value: string, key: keyof typeof forms) => {
    setForms({ ...forms, [key]: { ...forms[key], value } });
  };

  const updateRule = async () => {
    try {
      setLoading(true);

      const conditionForm = { ...rule.conditionForm };
      for (const key in conditionForm) {
        conditionForm[key] = forms[key];
      }

      const resultForm = { ...rule.resultForm };
      for (const key in resultForm) {
        resultForm[key] = forms[key];
      }

      await api.patch(`/rules/api/rules/${rule.id}/configuration`, {
        conditionForm,
        resultForm,
      });

      toast.success("Rule updated successfully");
      setConfirmOpen(false);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasError) updateRule();
  };

  return (
    <form className="flex flex-col gap-4 rounded-xl border bg-background-subtle p-3" onSubmit={handleSubmit}>
      <div className="flex items-center justify-between">
        <Typography variant="heading-4">{rule.name}</Typography>

        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="iconXSmall" onClick={onCancel}>
            <Icon name={closeIcon} size={18} color="current" />
          </Button>
          <Button type="button" size="iconXSmall" disabled={hasError} onClick={() => setConfirmOpen(true)}>
            <Icon name={checkedIcon} size={18} color="current" />
          </Button>
        </div>
      </div>

      <ul className="list-disc pl-5">
        <li>
          <div className="flex gap-2">
            {descriptionTemplate
              ?.split(" ")
              .map((text) => (
                <div key={text}>
                  {text.startsWith("{") && text.endsWith("}") ? (
                    <AlertRuleFormField
                      type={forms[text.slice(1, -1)]?.type}
                      value={forms[text.slice(1, -1)]?.value}
                      placeholder={forms[text.slice(1, -1)]?.label}
                      options={forms[text.slice(1, -1)]?.options}
                      onChange={(value) => handleChange(value, text.slice(1, -1))}
                    />
                  ) : (
                    <Typography className="mt-2">{text}</Typography>
                  )}
                </div>
              ))}
          </div>
        </li>
      </ul>

      <AlertRuleConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        rule={rule}
        forms={forms}
        loading={loading}
        onConfirm={updateRule}
      />
    </form>
  );
};
