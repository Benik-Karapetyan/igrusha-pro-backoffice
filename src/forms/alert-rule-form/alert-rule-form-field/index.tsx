import { useMemo } from "react";

import { ENUM_ALERT_RULE_FORM_FIELD_TYPE } from "@types";
import { Select, TextField, TimePicker, TimeSpanPicker } from "@ui-kit";
import { cn } from "@utils";

interface AlertRuleFormFieldProps {
  type: ENUM_ALERT_RULE_FORM_FIELD_TYPE;
  placeholder: string;
  value: string;
  options: string[] | null;
  onChange: (value: string) => void;
}

export const AlertRuleFormField = ({ type, placeholder, value, options, onChange }: AlertRuleFormFieldProps) => {
  const items = useMemo(() => options?.map((option) => ({ name: option, id: option })), [options]);

  return (
    <div
      className={cn(
        type === ENUM_ALERT_RULE_FORM_FIELD_TYPE.TimeSpan || type === ENUM_ALERT_RULE_FORM_FIELD_TYPE.TimeOnly
          ? "w-[214px]"
          : "w-[120px]"
      )}
    >
      {type === ENUM_ALERT_RULE_FORM_FIELD_TYPE.Decimal && (
        <TextField
          value={value}
          type="number"
          placeholder={placeholder}
          hideDetails
          errorMessage={
            !value ? `${placeholder} is required` : +value < 0 ? `${placeholder} must be greater than 0` : ""
          }
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {type === ENUM_ALERT_RULE_FORM_FIELD_TYPE.String && !!items?.length && (
        <>
          <Select
            value={value}
            placeholder={placeholder}
            hideDetails
            items={items}
            onValueChange={(value) => onChange(value)}
          />
        </>
      )}
      {type === ENUM_ALERT_RULE_FORM_FIELD_TYPE.Enum && !!items?.length && (
        <Select
          value={value}
          placeholder={placeholder}
          hideDetails
          items={items}
          onValueChange={(value) => onChange(value)}
        />
      )}
      {type === ENUM_ALERT_RULE_FORM_FIELD_TYPE.TimeSpan && (
        <TimeSpanPicker
          value={value}
          hideSeconds
          errorMessage={!value ? `${placeholder} is required` : ""}
          onChange={onChange}
        />
      )}
      {type === ENUM_ALERT_RULE_FORM_FIELD_TYPE.TimeOnly && (
        <TimePicker value={value} errorMessage={!value ? `${placeholder} is required` : ""} onChange={onChange} />
      )}
    </div>
  );
};
