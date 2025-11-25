import { ENUM_CUSTOMER_RISK_LEVEL, ENUM_CUSTOMER_STATUS } from "./enums";

export interface ICustomerMainInfo {
  id: number;
  identityId: string;
  fullName: string;
  emailAddress: string;
  country: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  accountCreationDate: string;
  lastLoginDate: string | null;
  status: ENUM_CUSTOMER_STATUS;
  restrictedActions: number[];
}

export interface ICustomerComplianceOverview {
  kycLevel: string;
  kycStatus: string;
  customerRiskLevel: ENUM_CUSTOMER_RISK_LEVEL;
  countryRiskLevel: string | null;
  vipLevel: string | null;
  residentialAddress: string | null;
  regionId: string | null;
  lastLoginCountry: string | null;
  lastIPUsed: string | null;
  applicantId: string | null;
  applicantLink: string | null;
  nextReviewDate: string | null;
  pepStatus: string | null;
  twoFactorEnabled: boolean;
}

export interface ICustomerNote {
  authorEmail: string;
  createdAt: string;
  note: string;
}

export interface IStatisticsFee {
  groupValue: string;
  amounts: { assetId: string; amount: number }[];
}

interface ICustomerAccountBalance {
  amount: number;
  equivalent: number;
  equivalentAssetId: string;
}

export interface ICustomerAccount {
  type: string;
  assetId: string;
  available: ICustomerAccountBalance;
  locked: ICustomerAccountBalance;
  total: ICustomerAccountBalance;
}
