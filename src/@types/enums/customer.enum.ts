export enum ENUM_CUSTOMER_STATUS {
  Active = 1,
  Dormant = 2,
  Banned = 3,
  Closed = 4,
  ClosedByAdmin = 5,
}

export enum ENUM_CUSTOMER_KYC_STATUS {
  NotSubmitted = "NotSubmitted",
  DocumentsRequested = "DocumentsRequested",
  CheckCompleted = "CheckCompleted",
  Approved = "Approved",
  Rejected = "Rejected",
  ResubmissionRequested = "ResubmissionRequested",
  RequiresAction = "RequiresAction",
  Pending = "Pending",
}

export enum ENUM_CUSTOMER_RISK_LEVEL {
  Unknown = 0,
  Low = 1,
  Medium = 2,
  High = 3,
  Severe = 4,
}

export enum ENUM_AUDIT_LOG_ACTION {
  Blocked = 1,
  Deactivated = 2,
}

export enum ENUM_CUSTOMER_ACCOUNT_TYPE {
  Funding = 1,
  Trading = 2,
}

export enum ENUM_CUSTOMER_FEE_EVENT {
  SpotTrading = "SpotTrading",
  Withdraw = "Withdraw",
}
