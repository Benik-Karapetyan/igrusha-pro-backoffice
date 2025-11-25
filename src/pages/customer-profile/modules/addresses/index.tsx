import { TAddressesTabValue } from "@routes";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";

import { Deposit } from "./deposit";
import { Withdrawal } from "./withdrawal";

export const Addresses = () => {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/auth/customers/$id" });
  const { tab, addressesTab } = useSearch({ from: "/auth/customers/$id" });

  const handleTabClick = (value: TAddressesTabValue) => {
    void navigate({
      to: "/customers/$id",
      params: { id: String(id) },
      search: { tab, addressesTab: value },
    });
  };

  return (
    <Tabs defaultValue={addressesTab || "deposit"} className="flex flex-col gap-6">
      <TabsList variant="secondary" className="w-fit">
        <TabsTrigger value="deposit" variant="secondary" onClick={() => handleTabClick("deposit")}>
          Deposit
        </TabsTrigger>
        <TabsTrigger value="withdrawal" variant="secondary" onClick={() => handleTabClick("withdrawal")}>
          Withdrawal
        </TabsTrigger>
      </TabsList>

      <TabsContent value="deposit">
        <Deposit />
      </TabsContent>
      <TabsContent value="withdrawal">
        <Withdrawal />
      </TabsContent>
    </Tabs>
  );
};
