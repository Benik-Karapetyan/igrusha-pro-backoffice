import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface DeleteEntryDialogProps {
  onSuccess: () => void;
}

export const DeleteEntryDialog = ({ onSuccess }: DeleteEntryDialogProps) => {
  const toast = useToast();
  const selectedEntryId = useStore((s) => s.selectedEntryId);
  const setSelectedEntryId = useStore((s) => s.setSelectedEntryId);
  const [loading, setLoading] = useState(false);

  const deleteEntry = async () => {
    try {
      setLoading(true);

      await api.delete(`/entries/${selectedEntryId}`);

      setSelectedEntryId(null);
      toast.success("Entry deleted successfully");
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedEntryId}
      onOpenChange={() => setSelectedEntryId(null)}
      title="Delete Entry"
      text="Are you sure you want to delete this entry?"
      confirmBtnVariant="critical"
      confirmBtnText="Delete"
      loading={loading}
      onConfirm={deleteEntry}
    />
  );
};
