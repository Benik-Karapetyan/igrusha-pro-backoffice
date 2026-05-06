import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface DeleteUtilizedProductDialogProps {
  onSuccess: () => void;
}

export const DeleteUtilizedProductDialog = ({ onSuccess }: DeleteUtilizedProductDialogProps) => {
  const toast = useToast();
  const selectedUtilizedProductId = useStore((s) => s.selectedUtilizedProductId);
  const setSelectedUtilizedProductId = useStore((s) => s.setSelectedUtilizedProductId);
  const [loading, setLoading] = useState(false);

  const deleteUtilizedProduct = async () => {
    try {
      setLoading(true);

      await api.delete(`/utilized-products/${selectedUtilizedProductId}`);

      setSelectedUtilizedProductId(null);
      toast.success("Utilized product deleted successfully");
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedUtilizedProductId}
      onOpenChange={() => setSelectedUtilizedProductId(null)}
      title="Delete Utilized Product"
      text="Are you sure you want to delete this utilized product?"
      confirmBtnVariant="critical"
      confirmBtnText="Delete"
      loading={loading}
      onConfirm={deleteUtilizedProduct}
    />
  );
};
