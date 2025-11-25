export enum ENUM_ON_CHAIN_TRANSACTION_ACTION {
  Deposit = 1,
  Withdrawal = 2,
}

export enum ENUM_ON_CHAIN_TRANSACTION_STATUS {
  Completed = "Completed",
  Canceled = "Canceled",
  Pending = "Pending",
  InProgress = "InProgress",
}

export enum ENUM_ON_CHAIN_TRANSACTION_SEARCH_TERM {
  CustomerId = "CustomerId",
  TransactionId = "TransactionId",
  TransactionHash = "TransactionHash",
}

export enum ENUM_ON_OFF_RAMP_TRANSACTION_TYPE {
  OnRamp = 1,
  OffRamp = 2,
  Refund = 3,
}

export enum ENUM_ON_OFF_RAMP_STATUS {
  New = 1,
  Processing = 2,
  Failed = 3,
  InternalFailed = 4,
  Cancelled = 5,
  Rejected = 6,
  PendingProviderApproval = 7,
  Finished = 8,
  PaySuccess = 9,
}

export enum ENUM_ON_OFF_RAMP_GROUPED_STATUS {
  InProgress = 1,
  Pending = 2,
  Completed = 3,
  Rejected = 4,
}
