import { AppHeader } from "@containers";
import { TDepositAnalyticsTabValue } from "@routes";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";

import { ByAsset } from "./modules/by-asset";
import { Network } from "./modules/network";

export const DepositAnalyticsPage = () => {
  const navigate = useNavigate();
  const { tab } = useSearch({ from: "/auth/deposit-analytics" });

  const handleTabClick = (value: TDepositAnalyticsTabValue) => {
    navigate({ to: "/deposit-analytics", search: { tab: value } });
  };

  return (
    <Tabs defaultValue={tab || "byAsset"}>
      <AppHeader
        title="Deposit Analytics"
        Tabs={
          <TabsList>
            <TabsTrigger value="byAsset" onClick={() => handleTabClick("byAsset")}>
              By Asset
            </TabsTrigger>
            <TabsTrigger value="network" onClick={() => handleTabClick("network")}>
              Network
            </TabsTrigger>
          </TabsList>
        }
      />

      <TabsContent value="byAsset">
        <ByAsset />
      </TabsContent>

      <TabsContent value="network">
        <Network />
      </TabsContent>
    </Tabs>
  );
};
