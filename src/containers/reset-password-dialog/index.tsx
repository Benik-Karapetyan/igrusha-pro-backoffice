import { FC, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";
import { getErrorMessage } from "@utils";

export const ResetPasswordDialog: FC = () => {
  const toast = useToast();
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const resetPasswordData = useStore((s) => s.resetPasswordData);
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    try {
      setLoading(true);
      await api.post("/bo/api/auth/reset-password", resetPasswordData);
      setDialogs([]);
      toast.success("Password reset email sent successfully");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogs.includes("resetPassword")} onOpenChange={(value) => setDialogs(value ? ["status"] : [])}>
      <DialogContent className="w-[400px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="w-full text-center">Reset Admin User Password</DialogTitle>
        </DialogHeader>

        <DialogDescription>An email will be sent to the user to reset their password.</DialogDescription>

        <DialogFooter className="gap-4">
          <Button variant="outline" className="w-[160px]" onClick={() => setDialogs([])}>
            Cancel
          </Button>
          <Button loading={loading} className="w-[160px]" onClick={resetPassword}>
            Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
