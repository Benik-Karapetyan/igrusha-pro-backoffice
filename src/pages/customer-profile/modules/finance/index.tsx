import { TFinanceTabValue } from "@routes";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";

import { Fees } from "./fees";
import { FinanceOverview } from "./finance-overview";

export const Finance = () => {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/auth/customers/$id" });
  const { tab, financeTab } = useSearch({ from: "/auth/customers/$id" });

  const handleTabClick = (value: TFinanceTabValue) => {
    navigate({ to: "/customers/$id", params: { id: String(id) }, search: { tab, financeTab: value } });
  };

  return (
    <Tabs defaultValue={financeTab || "overview"} className="flex flex-col gap-6">
      <TabsList variant="secondary" className="w-fit">
        <TabsTrigger value="overview" variant="secondary" onClick={() => handleTabClick("overview")}>
          Overview
        </TabsTrigger>
        <TabsTrigger value="fees" variant="secondary" onClick={() => handleTabClick("fees")}>
          Fees
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <FinanceOverview />
      </TabsContent>

      <TabsContent value="fees">
        <Fees />
      </TabsContent>
    </Tabs>
  );
};
