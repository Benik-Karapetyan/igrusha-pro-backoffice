import { AppHeader } from "@containers";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";

import { TTransactionsTabValue } from "../../routes/transactions/transactions.consts";
import { OnChain } from "./modules/on-chain";

export const TransactionsPage = () => {
  const navigate = useNavigate();
  const { tab } = useSearch({ from: "/auth/transactions" });

  const handleTabClick = (value: TTransactionsTabValue) => {
    navigate({ to: "/transactions", search: { tab: value } });
  };

  return (
    <Tabs defaultValue={tab || "onChain"}>
      <AppHeader
        title="Transactions"
        Tabs={
          <div className="flex justify-between border-b px-5 py-4">
            <TabsList>
              <TabsTrigger value="onChain" onClick={() => handleTabClick("onChain")}>
                On-Chain
              </TabsTrigger>
            </TabsList>
          </div>
        }
      />

      <TabsContent value="onChain">
        <OnChain />
      </TabsContent>
    </Tabs>
  );
};
