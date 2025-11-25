import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Typography } from "@ui-kit";

interface ApiKeyDetailsDialogProps {
  onSubmit: () => void;
  status?: string | number;
  loading?: boolean;
}

export const ApiKeyDeactivationDialog = ({ onSubmit, status, loading }: ApiKeyDetailsDialogProps) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);

  return (
    <Dialog open={dialogs.includes("apiKeyDetailsStatus")}>
      <DialogContent className="w-[400px]">
        <DialogTitle />
        <DialogHeader>Deactivate</DialogHeader>

        <div className="flex flex-col gap-4 px-6 py-3">
          <Typography variant="body-base">
            Are you sure you want to {status === 1 ? "deactivate" : "activate"} this{" "}
            <span className="font-semibold">“Trading Main Key”</span> API?
          </Typography>

          <Typography variant="body-base">
            The customer will be notified via email about the {status === 1 ? "deactivation" : "activation"}.
          </Typography>
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setDialogs([])}>
            Cancel
          </Button>
          <Button type="button" variant={status === 1 ? "default" : "critical"} loading={loading} onClick={onSubmit}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
