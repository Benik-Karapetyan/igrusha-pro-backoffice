import { useSearch } from "@tanstack/react-router";
import { Typography } from "@ui-kit";

import { OrderHistory } from "./order-history";
import { TradingHistory } from "./trading-history";

export const Trading = () => {
  const { tradingTab } = useSearch({ from: "/auth/customers/$id" });

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="heading-4">Spot Trading</Typography>

      <div className="flex flex-col gap-4">
        {(!tradingTab || tradingTab === "orderHistory") && <OrderHistory />}
        {tradingTab === "tradingHistory" && <TradingHistory />}
      </div>
    </div>
  );
};
