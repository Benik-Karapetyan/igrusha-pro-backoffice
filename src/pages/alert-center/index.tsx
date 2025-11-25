import { AppHeader } from "@containers";
import { TAlertCenterTabValue } from "@routes";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";

import { OnChainTransactions } from "./modules/on-chain-transactions";

export const AlertCenterPage = () => {
  const navigate = useNavigate();
  const { tab } = useSearch({ from: "/auth/alert-center" });

  const handleTabClick = (tab: TAlertCenterTabValue) => {
    navigate({ to: "/alert-center", search: { tab } });
  };

  return (
    <Tabs defaultValue={tab || "onChainTransactions"}>
      <AppHeader
        title="Alert Center"
        Tabs={
          <TabsList>
            <TabsTrigger value="onChainTransactions" onClick={() => handleTabClick("onChainTransactions")}>
              On Chain Transactions
            </TabsTrigger>
          </TabsList>
        }
      />

      <div className="flex p-4">
        <TabsContent value="onChainTransactions" className="w-full">
          <OnChainTransactions />
        </TabsContent>
      </div>
    </Tabs>
  );
};
