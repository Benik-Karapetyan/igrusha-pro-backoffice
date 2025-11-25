export enum ENUM_PAYMENT_HISTORY_STATUS {
  New = 1,
  Processing = 2,
  Failed = 3,
  InternalFailed = 4,
  Cancelled = 5,
  Rejected = 6,
  PendingProviderApproval = 7,
  Success = 8,
}

export enum ENUM_PAYMENT_HISTORY_ORDER_TYPE {
  Buy = 0,
  Sell = 1,
  Refund = 2,
}
