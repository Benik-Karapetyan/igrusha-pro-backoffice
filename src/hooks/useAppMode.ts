import { useStore } from "@store";

export const useAppMode = () => {
  const appMode = useStore((s) => s.appMode);
  const storageAppMode = localStorage.getItem("storageAppMode");
  const isWallet = storageAppMode === "wallet" || appMode === "wallet";

  return {
    appMode,
    isWallet,
  };
};
