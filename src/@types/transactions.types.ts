import {
  ENUM_ON_CHAIN_TRANSACTION_STATUS,
  ENUM_ON_OFF_RAMP_GROUPED_STATUS,
  ENUM_ON_OFF_RAMP_STATUS,
  ENUM_ON_OFF_RAMP_TRANSACTION_TYPE,
} from "./enums";

type TAmount = {
  amount: string;
  currency: string;
};

export type TOnChainTransaction = {
  transactionId: string;
  status: ENUM_ON_CHAIN_TRANSACTION_STATUS;
  kind: ENUM_ON_OFF_RAMP_TRANSACTION_TYPE;
  network: string;
  amount: number;
  transactionAmount: TAmount;
  transactionHash: string;
  addressFrom: string;
  addressTo: string;
  memo: string | null;
  feeInternal: TAmount | null;
  feeThirdParty: TAmount | null;
  provider: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type TOnOffRampTransaction = {
  id: number;
  status: ENUM_ON_OFF_RAMP_STATUS;
  orderStatusGrouped: ENUM_ON_OFF_RAMP_GROUPED_STATUS;
  orderType: ENUM_ON_OFF_RAMP_TRANSACTION_TYPE;
  amount: number;
  fiatCurrency: string;
  commissionFee: number;
  cryptoAmount: number;
  currency: string;
  cryptoPrice: number;
  cryptoHash: string;
  paymentProviderName: string;
  providerOrderId: string;
  accountInfo: {
    name: string;
    account: string;
  };
};
