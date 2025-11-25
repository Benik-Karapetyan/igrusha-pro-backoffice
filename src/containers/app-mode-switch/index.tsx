import { useEffect, useState } from "react";

import { mdiWalletOutline } from "@mdi/js";
import { TAppMode, useStore } from "@store";
import { Icon, Switch, Typography } from "@ui-kit";
import { cn } from "@utils";

export const AppModeSwitch = () => {
  const isAppSidebarMini = useStore((s) => s.isAppSidebarMini);
  const setAppMode = useStore((s) => s.setAppMode);
  const [isWallet, setIsWallet] = useState(false);

  useEffect(() => {
    const storageAppMode = localStorage.getItem("storageAppMode");
    if (storageAppMode) {
      setIsWallet(storageAppMode === "wallet");
      setAppMode(storageAppMode as TAppMode);
    }
  }, [setAppMode]);

  return (
    <div className={cn("flex items-center justify-between px-4 py-3", isAppSidebarMini && "flex-col")}>
      <div className={cn("flex items-center gap-2", isAppSidebarMini && "flex-col gap-0")}>
        <Icon name={mdiWalletOutline} />
        <Typography className={cn(isAppSidebarMini && "text-center")}>Wallet</Typography>
      </div>

      <Switch
        checked={isWallet}
        onCheckedChange={(checked) => {
          setIsWallet(checked);
          setAppMode(checked ? "wallet" : "default");
          localStorage.setItem("storageAppMode", checked ? "wallet" : "default");
        }}
      />
    </div>
  );
};
