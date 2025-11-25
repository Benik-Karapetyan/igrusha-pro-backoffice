import { FC } from "react";

import { ICustomerAccount } from "@types";
import { DataTable, ProgressCircular, TableItem } from "@ui-kit";

import { NoBalances } from "../no-balances";
import { useCustomerAssetHeaders } from "./hooks/useCustomerAssetHeaders";

interface AssetsProps {
  loading: boolean;
  serverError: boolean;
  items: ICustomerAccount[];
}

export const Assets: FC<AssetsProps> = ({ loading, items, serverError }) => {
  const { headers } = useCustomerAssetHeaders();

  return loading ? (
    <div className="flex h-[calc(100vh_-_400px)] min-h-[400px] items-center justify-center p-5 text-segment-foreground-selected">
      <ProgressCircular indeterminate />
    </div>
  ) : serverError ? (
    <NoBalances
      title="Unable to Retrieve Balances"
      firstText="We're having trouble retrieving customer assets."
      secondText="Please refresh to try again."
    />
  ) : !items.length ? (
    <NoBalances
      title="No Balances Available Yet"
      firstText="This customer currently has no financial holdings."
      secondText="Balances and assets will appear here once they become available."
    />
  ) : (
    <div className="w-full overflow-hidden rounded-xl border">
      <div className="overflow-auto">
        <DataTable headers={headers} items={items as unknown as TableItem[]} loading={loading} hideFooter />
      </div>
    </div>
  );
};
