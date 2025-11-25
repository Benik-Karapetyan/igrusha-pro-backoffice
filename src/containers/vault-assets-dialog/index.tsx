import { mdiClose } from "@mdi/js";
import { useStore } from "@store";
import {
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Icon,
  TableItem,
} from "@ui-kit";

import { useVaultAssetHeaders } from "./hooks/useVaultAssetHeaders";
import { useVaultAssetNodeHeaders } from "./hooks/useVaultAssetNodeHeaders";

export const VaultAssetDialog = () => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const { headers: vaultAssetHeaders } = useVaultAssetHeaders();
  const { headers: vaultAssetNodeHeaders } = useVaultAssetNodeHeaders();
  const vaultAssets = useStore((s) => s.vaultAssets);
  const selectedVaultAssetNodes = useStore((s) => s.selectedVaultAssetNodes);
  const setSelectedVaultAssetNodes = useStore((s) => s.setSelectedVaultAssetNodes);
  const headers = selectedVaultAssetNodes.length ? vaultAssetNodeHeaders : vaultAssetHeaders;
  const items = (selectedVaultAssetNodes.length ? selectedVaultAssetNodes : vaultAssets) as unknown as TableItem[];

  const handleClose = () => {
    setDialogs([]);
  };

  return (
    <Dialog open={dialogs.includes("vaultAssets")} onOpenChange={(value) => setDialogs(value ? ["vaultAssets"] : [])}>
      <DialogContent className="min-w-[700px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{selectedVaultAssetNodes.length ? "Vault Asset Nodes" : "Vault Assets"}</DialogTitle>

          <Button variant="icon" size="icon" className="-mr-3" onClick={handleClose}>
            <Icon name={mdiClose} />
          </Button>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl border border-b-0">
          <DataTable headers={headers} items={items} hideFooter />
        </div>

        {!!selectedVaultAssetNodes.length && (
          <DialogFooter className="gap-4" onClick={() => setSelectedVaultAssetNodes([])}>
            <Button variant="outline" className="w-[160px]">
              Back
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
