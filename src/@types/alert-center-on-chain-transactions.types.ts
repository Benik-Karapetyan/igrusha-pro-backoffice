import { ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS, ENUM_ALERT_STATUS } from "./enums";

export interface IAlertCenterOnChainTransaction {
  id: string;
  status: ENUM_ALERT_CENTER_ON_CHAIN_DECISION_STATUS;
  alerts: IAlertCenterOnChainAlert[];
}

export interface IAlertCenterOnChainAlert {
  id: string;
  ruleName: string;
  alertDate: string;
  reaction: string;
  status: ENUM_ALERT_STATUS;
  ruleDescription: string;
}

export interface ISelectedAlert {
  id: string;
  status: ENUM_ALERT_STATUS;
}
