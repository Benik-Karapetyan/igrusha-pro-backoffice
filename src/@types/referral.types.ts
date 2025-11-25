import { ENUM_VERIFICATION_TRIGGER_TYPE } from "./enums";

export type DrawerDirection = "left" | "right";
export type DrawerSize = "xs" | "sm" | "md" | "lg" | "xl";

export type TReferralLevel = {
  id?: number;
  minReferrals: number;
  maxReferrals: number;
  maxCommissionPercent: number;
};

export type TReferralAsset = {
  id: number;
  name: string;
  coin: {
    symbol: string;
  };
  amount: number;
};

export type TBonusesList = {
  amount: number;
  fiatAmount: number;
  coinSymbol: string;
  coinName: string;
  threshold: number;
  isClaimable: boolean;
  isClaimed: boolean;
};

type TReferrer = {
  id: string;
  customerId: number;
};

type TRewardsSummary = {
  assetId: number;
  amount: number;
};

type TCalculation = {
  type: number;
  percent: null;
  amount: number;
  assetId: null;
};

type TUsage = {
  type: number;
  percent: null;
  maxUsage: null;
};

type TRewardElementDetails = {
  calculation: TCalculation;
  usage: TUsage;
};

type TReward = {
  id: string;
  campaignId: string;
  type: number;
  receiver: number;
  details: null;
  daysToGrab: number;
  createdAt: Date;
};

type TRewardElement = {
  id: string;
  rewardId: string;
  reward: TReward;
  recieverType: number;
  details: TRewardElementDetails;
  initiatorId: string;
  userId: string;
  createdAt: Date;
};

export type TReferralUser = {
  referralLink: string;
  status: string;
  referralsCashbackTotal: number;
  referralsCashbackPaid: number;
  referralsCashbackAvailable: number;
  referralsCashbackClaimable: number;
  fiatCurrency: string;
  bonusesList: TBonusesList[];
  customerId: number;
  id: string;
  referrerUserId: string;
  referrer: TReferrer | null;
  referrals: TReferralUser[];
  level: string;
  referralsCount: number;
  verifiedReferralsCount: number;
  remainingVerifiedReferralsForNextLevel: number;
  verifiedReferralsCountInCurrentLevel: number;
  selfMaxCommissionPercent: number;
  nextLevelMaxCommissionPercent: number;
  selfCashbackRewardPercent: number;
  selfTradingFeeDiscountPercent: number;
  parentCashbackRewardPercent: number;
  parentTradingFeeDiscountPercent: number;
  cashbackRewardPercentIncrementStep: number;
  maxLevelReached: boolean;
  referralCode: string;
  rewardsSummary: TRewardsSummary[];
  rewards: TRewardElement[];
  region: string;
  createdAt: Date;
};

export type TVerificationTrigger = {
  id: number;
  name: string;
  type: ENUM_VERIFICATION_TRIGGER_TYPE;
  status: number;
  enabled: boolean;
  amount: number | null;
};
