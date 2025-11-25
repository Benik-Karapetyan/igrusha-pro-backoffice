import { useState } from "react";

import { TReferralTabValue } from "@routes";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";

import { LevelConfig } from "./modules/level-config";
import { UserManagement } from "./modules/user-management";
import { WithdrawalThreshold } from "./modules/withdrawal-threshold";

export const ReferralPage = () => {
  const navigate = useNavigate();
  const { tab } = useSearch({ from: "/auth/referral" });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTabClick = (tab: TReferralTabValue) => {
    navigate({ to: "/referral", search: { tab } });
  };

  return (
    <Tabs defaultValue={tab || "levelConfig"}>
      <div className="flex h-14 items-center gap-4 rounded-tl-xl border-b bg-background-subtle px-4">
        <div className="flex items-center gap-2">
          <div className="w-[151px] font-semibold">Referral</div>

          <div className="h-5 border-l border-stroke-divider"></div>
        </div>

        <TabsList>
          <TabsTrigger value="levelConfig" onClick={() => handleTabClick("levelConfig")}>
            Level Config
          </TabsTrigger>
          <TabsTrigger value="userManagement" onClick={() => handleTabClick("userManagement")}>
            User Management
          </TabsTrigger>
          <TabsTrigger value="withdrawalThreshold" onClick={() => handleTabClick("withdrawalThreshold")}>
            Withdrawal Threshold
          </TabsTrigger>
        </TabsList>

        <div className="flex grow justify-end">
          {tab === "withdrawalThreshold" && <Button onClick={() => setDrawerOpen(true)}>Set Min Payout</Button>}
        </div>
      </div>

      <TabsContent value="levelConfig" className="p-4">
        <LevelConfig />
      </TabsContent>
      <TabsContent value="userManagement" className="p-4">
        <UserManagement />
      </TabsContent>
      <TabsContent value="withdrawalThreshold" className="p-4">
        <WithdrawalThreshold drawerOpen={drawerOpen} onDrawerOpenChange={setDrawerOpen} />
      </TabsContent>
    </Tabs>
  );
};
