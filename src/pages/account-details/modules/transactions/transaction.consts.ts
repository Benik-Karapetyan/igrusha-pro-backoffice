import { ENUM_TRANSACTION_ORDER_TYPE } from "@types";

export const itemsPerPage = [
  { name: "10", id: 10 },
  { name: "50", id: 50 },
  { name: "100", id: 100 },
];

export const transactionOrderTypes = [
  { name: "Deposit", id: ENUM_TRANSACTION_ORDER_TYPE.deposit },
  { name: "Manual Transfer", id: ENUM_TRANSACTION_ORDER_TYPE.manualTransfer },
  { name: "Withdraw Prepare", id: ENUM_TRANSACTION_ORDER_TYPE.withdrawPrepare },
  { name: "Withdraw Complete", id: ENUM_TRANSACTION_ORDER_TYPE.withdrawComplete },
  { name: "Withdraw Rollback", id: ENUM_TRANSACTION_ORDER_TYPE.withdrawRollback },
  { name: "Investment Owner Deposit", id: ENUM_TRANSACTION_ORDER_TYPE.investmentOwnerDeposit },
  { name: "Trading Spot Place Order", id: ENUM_TRANSACTION_ORDER_TYPE.tradingSpotPlaceOrder },
  { name: "Trading Spot Cancel Order", id: ENUM_TRANSACTION_ORDER_TYPE.tradingSpotCancelOrder },
  { name: "Trading Spot Trade", id: ENUM_TRANSACTION_ORDER_TYPE.tradingSpotTrade },
  { name: "Referral Replenishment", id: ENUM_TRANSACTION_ORDER_TYPE.referralReplenishment },
  { name: "Referral Trade Reward", id: ENUM_TRANSACTION_ORDER_TYPE.referralTradeReward },
  { name: "Referral Claim", id: ENUM_TRANSACTION_ORDER_TYPE.referralClaim },
  { name: "Spot Trading Transit", id: ENUM_TRANSACTION_ORDER_TYPE.spotTradingTransit },
  { name: "Spot Trading Fees", id: ENUM_TRANSACTION_ORDER_TYPE.spotTradingFees },
  { name: "Client Internal Transfer", id: ENUM_TRANSACTION_ORDER_TYPE.clientInternalTransfer },
];
