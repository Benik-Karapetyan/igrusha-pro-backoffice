import { FC } from "react";

import { mdiMinus } from "@mdi/js";
import { ICustomerAccount } from "@types";
import { Icon, Skeleton, Typography } from "@ui-kit";
import { formatAmount } from "@utils";

interface AccountsOverviewProps {
  spotAccount?: ICustomerAccount;
  fundingAccount?: ICustomerAccount;
  loading: boolean;
  isError: boolean;
}

export const AccountsOverview: FC<AccountsOverviewProps> = ({ spotAccount, fundingAccount, loading, isError }) => {
  return (
    <div className="flex w-2/3 gap-4">
      <div className="flex w-full gap-3 rounded-xl border bg-white p-3">
        <div className="h-full w-1.5 rounded-md bg-success-primary" />

        <div className="flex flex-col gap-2">
          <Typography variant="body-sm" color="secondary">
            Trading Account
          </Typography>

          {loading ? (
            <Skeleton className="h-5 w-48" />
          ) : isError ? (
            <Icon name={mdiMinus} dense />
          ) : (
            <Typography variant="heading-4" className="py-0.5">
              {formatAmount(spotAccount?.total.equivalent)} {spotAccount?.total.equivalentAssetId}
            </Typography>
          )}
        </div>
      </div>

      <div className="flex w-full gap-3 rounded-xl border bg-white p-3">
        <div className="h-full w-1.5 rounded-md bg-stable-primary" />

        <div className="flex flex-col gap-2">
          <Typography variant="body-sm" color="secondary">
            Funding Account
          </Typography>

          {loading ? (
            <Skeleton className="h-5 w-48" />
          ) : isError ? (
            <Icon name={mdiMinus} dense />
          ) : (
            <Typography variant="heading-4" className="py-0.5">
              {formatAmount(fundingAccount?.total.equivalent)} {fundingAccount?.total.equivalentAssetId}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
};
