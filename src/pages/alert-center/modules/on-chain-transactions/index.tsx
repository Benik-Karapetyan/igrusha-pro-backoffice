import { TOnChainTransactionsTabValue } from "@routes";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";

import { Settings } from "./settings";
import { Transactions } from "./transactions";

export const OnChainTransactions = () => {
  const navigate = useNavigate();
  const { tab, onChainTransactionsTab } = useSearch({ from: "/auth/alert-center" });

  const handleTabClick = (value: TOnChainTransactionsTabValue) => {
    navigate({ to: "/alert-center", search: { tab, onChainTransactionsTab: value } });
  };

  return (
    <Tabs defaultValue={onChainTransactionsTab || "transactions"} className="flex flex-col gap-6">
      <TabsList variant="secondary" className="w-fit">
        <TabsTrigger value="transactions" variant="secondary" onClick={() => handleTabClick("transactions")}>
          Transactions
        </TabsTrigger>
        <TabsTrigger value="settings" variant="secondary" onClick={() => handleTabClick("settings")}>
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="transactions">
        <Transactions />
      </TabsContent>

      <TabsContent value="settings">
        <Settings />
      </TabsContent>
    </Tabs>
  );
};
