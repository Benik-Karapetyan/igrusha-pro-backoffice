import { FC } from "react";

import { Skeleton, Typography } from "@ui-kit";
import { formatAmount } from "@utils";

interface BalanceProps {
  amount: number;
  currency: string;
  loading: boolean;
  isError: boolean;
}

export const Balance: FC<BalanceProps> = ({ amount, currency, loading, isError }) => {
  return (
    <div className="flex w-1/3 flex-col gap-1 px-3 py-2">
      <Typography color="secondary" as="h5">
        Total Portfolio Value
      </Typography>
      {loading ? (
        <Skeleton className="h-8 w-80" />
      ) : isError ? (
        <Typography variant="heading-2">Unable to retrieve data</Typography>
      ) : (
        <Typography variant="heading-2">
          {formatAmount(amount)} {currency}
        </Typography>
      )}
    </div>
  );
};
