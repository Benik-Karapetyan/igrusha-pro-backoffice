import { useStore } from "@store";
import { Button, DrawerFooter, DrawerHeader, DrawerTitle } from "@ui-kit";

import { OnChainTransactionStatusCell } from "..";
import { AppDrawer } from "../../app-drawer";
import { OnChainTransactionInfo } from "../on-chain-transaction-info";
import { OnChainTransactionLogHistory } from "../on-chain-transaction-log-history";

export const OnChainTransactionDrawer = () => {
  const selectedOnChainTransaction = useStore((s) => s.selectedOnChainTransaction);
  const setSelectedOnChainTransaction = useStore((s) => s.setSelectedOnChainTransaction);

  return (
    <AppDrawer open={!!selectedOnChainTransaction} onOpenChange={() => setSelectedOnChainTransaction(null)} size="xl">
      <DrawerHeader>
        <DrawerTitle>{selectedOnChainTransaction?.transactionId}</DrawerTitle>

        {selectedOnChainTransaction?.status && (
          <OnChainTransactionStatusCell status={selectedOnChainTransaction.status} />
        )}
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 overflow-auto p-4">
        <OnChainTransactionInfo />

        <OnChainTransactionLogHistory />
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={() => setSelectedOnChainTransaction(null)}>
          Close
        </Button>
      </DrawerFooter>
    </AppDrawer>
  );
};
