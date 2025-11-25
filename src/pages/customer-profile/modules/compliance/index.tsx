import { TComplianceTabValue } from "@routes";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";

import { ComplianceOverview } from "./compliance-overview";
import { IpAddresses } from "./ip-addresses";

export const Compliance = () => {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/auth/customers/$id" });
  const { tab, complianceTab } = useSearch({ from: "/auth/customers/$id" });

  const handleTabClick = (value: TComplianceTabValue) => {
    navigate({ to: "/customers/$id", params: { id: String(id) }, search: { tab, complianceTab: value } });
  };

  return (
    <Tabs defaultValue={complianceTab || "overview"} className="flex flex-col gap-6">
      <TabsList variant="secondary" className="w-fit">
        <TabsTrigger value="overview" variant="secondary" onClick={() => handleTabClick("overview")}>
          Overview
        </TabsTrigger>
        <TabsTrigger value="ipAddresses" variant="secondary" onClick={() => handleTabClick("ipAddresses")}>
          IP Addresses
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <ComplianceOverview />
      </TabsContent>

      <TabsContent value="ipAddresses">
        <IpAddresses />
      </TabsContent>
    </Tabs>
  );
};
