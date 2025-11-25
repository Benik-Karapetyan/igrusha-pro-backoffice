import { ENUM_TRADING_CONTEST_STATUS } from "./enums";

export interface ITradingContestDetails {
  name: string;
  startDate: string;
  endDate: string;
  state: ENUM_TRADING_CONTEST_STATUS;
  prizeSymbol: string;
  prize: number;
  joinedCustomers: number;
  tradingVolume: number | null;
  markets: { marketSymbol: string }[];
}

export interface ITradingContestCustomer {
  id: number;
  identityId: string;
  tradingPairs: string[];
  joinedAt: string;
}
