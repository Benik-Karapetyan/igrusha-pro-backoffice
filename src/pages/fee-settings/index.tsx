import { useState } from "react";

import { emptyLevelFee } from "@forms";
import { TFeeSettingsTabValue } from "@routes";
import { useStore } from "@store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";

import { CustomFee } from "./modules/custom-fee";
import { LevelsFee } from "./modules/levels-fee";

export const FeeSettingsPage = () => {
  const navigate = useNavigate();
  const { tab } = useSearch({ from: "/auth/fee-settings" });
  const setLevelFee = useStore((s) => s.setLevelFee);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setDrawerOpen = useStore((s) => s.setDrawerOpen);
  const [hasData, setHasData] = useState(false);

  const handleTabClick = (tab: TFeeSettingsTabValue) => {
    navigate({ to: "/fee-settings", search: { tab } });
  };

  const handleCreateClick = () => {
    if (tab === "levelsFee") setLevelFee(emptyLevelFee);
    setDialogMode("create");
    setDrawerOpen(true);
  };

  return (
    <Tabs defaultValue={tab || "levelsFee"}>
      <div className="flex h-14 items-center gap-4 rounded-tl-xl border-b bg-background-subtle px-4">
        <div className="flex items-center gap-2">
          <div className="w-[151px] font-semibold">Fee Settings</div>

          <div className="h-5 border-l border-stroke-divider"></div>
        </div>

        <TabsList>
          <TabsTrigger value="levelsFee" onClick={() => handleTabClick("levelsFee")}>
            Levels Fee
          </TabsTrigger>
          <TabsTrigger value="customFee" onClick={() => handleTabClick("customFee")}>
            Custom Fee
          </TabsTrigger>
        </TabsList>

        {hasData && (
          <Button className="ml-auto" onClick={handleCreateClick}>
            {!tab || tab === "levelsFee" ? "Create Level" : "Create Custom Fee"}
          </Button>
        )}
      </div>

      <TabsContent value="levelsFee" className="p-4">
        <LevelsFee onDataReceived={setHasData} />
      </TabsContent>
      <TabsContent value="customFee" className="p-4">
        <CustomFee onDataReceived={setHasData} />
      </TabsContent>
    </Tabs>
  );
};
