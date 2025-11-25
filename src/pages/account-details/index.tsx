import { TAccountDetailsTabValue } from "@routes";
import { Link, useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Button, Icon, Tabs, TabsContent, TabsList, TabsTrigger, Typography } from "@ui-kit";
import { arrowLeftIcon } from "@utils";

import { Balances } from "./modules/balances";
import { Transactions } from "./modules/transactions";

export const AccountDetailsPage = () => {
  const navigate = useNavigate();
  const { type, id } = useParams({ from: "/auth/accounts/$type/$id" });
  const { accountName, tab } = useSearch({ from: "/auth/accounts/$type/$id" });

  const handleTabClick = (tab: TAccountDetailsTabValue) => {
    navigate({ to: "/accounts/$type/$id", params: { type, id }, search: { accountName, tab } });
  };

  return (
    <Tabs defaultValue={tab || "balances"}>
      <div className="flex h-14 gap-4 rounded-tl-xl border-b bg-background-subtle px-4">
        <div className="flex items-center gap-2">
          <Link to="/accounts">
            <Button variant="ghost" size="iconSmall">
              <Icon name={arrowLeftIcon} />
            </Button>
          </Link>

          <div className="flex flex-col">
            <Typography variant="heading-3" className="capitalize">
              {accountName}
            </Typography>
            <Typography variant="body-sm" color="secondary">
              ID: {id}
            </Typography>
          </div>

          <div className="ml-4 h-5 w-[1px] bg-stroke-divider" />
        </div>

        <TabsList>
          <TabsTrigger value="balances" onClick={() => handleTabClick("balances")}>
            Balances
          </TabsTrigger>
          <TabsTrigger value="transactions" onClick={() => handleTabClick("transactions")}>
            Transactions
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="balances" className="p-4">
        <Balances />
      </TabsContent>
      <TabsContent value="transactions" className="p-4">
        <Transactions />
      </TabsContent>
    </Tabs>
  );
};
