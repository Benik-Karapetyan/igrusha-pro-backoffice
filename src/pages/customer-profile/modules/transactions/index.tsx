import { useAppMode } from "@hooks";
import { TTransactionsTabValue } from "@routes";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";

import { OnChain } from "./on-chain";
import { OnOffRampHistory } from "./on-off-ramp-history";

export const Transactions = () => {
  const { isWallet } = useAppMode();
  const navigate = useNavigate();
  const { id } = useParams({ from: "/auth/customers/$id" });
  const { tab, transactionsTab } = useSearch({ from: "/auth/customers/$id" });

  const handleTabClick = (value: TTransactionsTabValue) => {
    void navigate({
      to: "/customers/$id",
      params: { id: String(id) },
      search: { tab, transactionsTab: value },
    });
  };

  return (
    <Tabs defaultValue={transactionsTab || "onChain"} className="flex flex-col gap-6">
      <TabsList variant="secondary" className="w-fit">
        <TabsTrigger value="onChain" variant="secondary" onClick={() => handleTabClick("onChain")}>
          On-Chain
        </TabsTrigger>
        {!isWallet && (
          <TabsTrigger value="onOffRampHistory" variant="secondary" onClick={() => handleTabClick("onOffRampHistory")}>
            On/Off-Ramp History
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="onChain">
        <OnChain />
      </TabsContent>
      {!isWallet && (
        <TabsContent value="onOffRampHistory">
          <OnOffRampHistory />
        </TabsContent>
      )}
    </Tabs>
  );
};
