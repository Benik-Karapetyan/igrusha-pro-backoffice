export type TAccount = {
  name: string;
  number: number;
  type: string;
  accountCategory: "Active" | "Passive";
};

export type TBalance = {
  currency: string;
  amount: number;
};

export type TBalanceItem = {
  base: TBalance;
  quote?: TBalance;
};

export type TAccountBalance = {
  balances: TBalanceItem[];
  totalBalance: TBalanceItem;
};

export type TCursors = {
  nextCursor: string | null;
  previousCursor: string | null;
};
