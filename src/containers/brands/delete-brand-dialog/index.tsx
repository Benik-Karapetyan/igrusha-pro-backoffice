import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface DeleteBrandDialogProps {
  onSuccess: () => void;
}

export const DeleteBrandDialog = ({ onSuccess }: DeleteBrandDialogProps) => {
  const toast = useToast();
  const selectedBrandId = useStore((s) => s.selectedBrandId);
  const setSelectedBrandId = useStore((s) => s.setSelectedBrandId);
  const [loading, setLoading] = useState(false);

  const deleteBrand = async () => {
    try {
      setLoading(true);

      await api.delete(`/brands/${selectedBrandId}`);
      setSelectedBrandId(null);
      toast.success("Brand deleted successfully");
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedBrandId}
      onOpenChange={() => setSelectedBrandId(null)}
      title="Delete Brand"
      text="Are you sure you want to delete this brand?"
      onCancel={() => setSelectedBrandId(null)}
      confirmBtnText="Delete"
      confirmBtnVariant="critical"
      loading={loading}
      onConfirm={deleteBrand}
    />
  );
};
