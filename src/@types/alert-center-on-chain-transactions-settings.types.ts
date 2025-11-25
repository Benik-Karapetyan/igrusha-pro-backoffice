import { ENUM_ALERT_RULE_FORM_FIELD_TYPE } from "./enums/alert-center-on-chain-transactions-settings.enum";

export interface IAlertRuleFormValue {
  label: string;
  value: string;
  type: ENUM_ALERT_RULE_FORM_FIELD_TYPE;
  options: string[] | null;
}

export interface IAlertRuleForm {
  [key: string]: IAlertRuleFormValue;
}

export interface IAlertRule {
  id: string;
  name: string;
  description: string;
  descriptionTemplate: string;
  enabled: boolean;
  workflowName: string;
  conditionForm: IAlertRuleForm;
  resultForm: IAlertRuleForm;
}
