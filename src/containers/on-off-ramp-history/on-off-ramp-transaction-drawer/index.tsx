import { useStore } from "@store";
import { Button, DrawerFooter, DrawerHeader, DrawerTitle } from "@ui-kit";

import { OnOffRampHistoryGroupedStatusCell, OnOffRampHistoryNotes } from "..";
import { AppDrawer } from "../../app-drawer";
import { OnOffRampTransactionInfo } from "../on-off-ramp-transaction-info";

export const OnOffRampTransactionDrawer = () => {
  const selectedOnOffRampTransaction = useStore((s) => s.selectedOnOffRampTransaction);
  const setSelectedOnOffRampTransaction = useStore((s) => s.setSelectedOnOffRampTransaction);

  return (
    <AppDrawer open={!!selectedOnOffRampTransaction} onOpenChange={() => setSelectedOnOffRampTransaction(null)}>
      <DrawerHeader>
        <DrawerTitle>{selectedOnOffRampTransaction?.id}</DrawerTitle>

        {selectedOnOffRampTransaction?.orderStatusGrouped && (
          <OnOffRampHistoryGroupedStatusCell status={selectedOnOffRampTransaction.orderStatusGrouped} />
        )}
      </DrawerHeader>

      <div className="flex h-[calc(100vh_-_8rem)] flex-col gap-4 p-4">
        <OnOffRampTransactionInfo />

        <OnOffRampHistoryNotes />
      </div>

      <DrawerFooter>
        <Button type="button" variant="ghost" onClick={() => setSelectedOnOffRampTransaction(null)}>
          Close
        </Button>
      </DrawerFooter>
    </AppDrawer>
  );
};
