interface IPrice {
  amount: string | null;
  currency: string | null;
}

interface ITransactionDetailsHistory {
  type: string;
  description: string;
  amount: string;
}

export interface ITransactionDetails {
  customerId: string | null;
  email: string | null;
  statusReason: string | null;
  statusDetails: string | null;
  kind: string | null;
  transactionAmount: IPrice | null;
  feeInternal: IPrice | null;
  feeThirdParty: IPrice | null;
  addressFrom: string | null;
  addressTo: string | null;
  memo: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  history: ITransactionDetailsHistory[];
}
