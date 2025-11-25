import { FC, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";
import { getErrorMessage } from "@utils";

interface StatusDialogProps {
  title: string;
  updateUrl: string;
  description?: string;
  onSuccess: () => void;
}

export const StatusDialog: FC<StatusDialogProps> = ({ title, updateUrl, description, onSuccess }) => {
  const toast = useToast();
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const enabled = useStore((s) => s.selectedElementEnabled);
  const selectedIds = useStore((s) => s.selectedIds);
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    try {
      setLoading(true);
      await api.put(`/bo/api/${updateUrl}/enable?enable=${!enabled}`, selectedIds);
      setDialogs([]);
      toast.success(`${title} has been updated`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogs.includes("status")} onOpenChange={(value) => setDialogs(value ? ["status"] : [])}>
      <DialogContent className="w-[400px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="w-full text-center">
            Are you sure you want to {enabled ? "disable" : "enable"}?
          </DialogTitle>
        </DialogHeader>

        {description && <DialogDescription>{description}</DialogDescription>}

        <DialogFooter className="gap-4">
          <Button variant="outline" className="w-[160px]" onClick={() => setDialogs([])}>
            Cancel
          </Button>
          <Button loading={loading} className="w-[160px]" onClick={updateStatus}>
            {enabled ? "Deactivate" : "Activate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
