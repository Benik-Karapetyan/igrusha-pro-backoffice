import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface DeleteProcurementProductDialogProps {
  onSuccess: () => void;
}

export const DeleteProcurementProductDialog = ({ onSuccess }: DeleteProcurementProductDialogProps) => {
  const toast = useToast();
  const selectedProcurementProductId = useStore((s) => s.selectedProcurementProductId);
  const setSelectedProcurementProductId = useStore((s) => s.setSelectedProcurementProductId);
  const [loading, setLoading] = useState(false);

  const deleteProduct = async () => {
    try {
      setLoading(true);

      await api.delete(`/procurement-products/${selectedProcurementProductId}`);

      setSelectedProcurementProductId(null);
      toast.success("Procurement product deleted successfully");
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedProcurementProductId}
      onOpenChange={() => setSelectedProcurementProductId(null)}
      title="Delete Procurement Product"
      text="Are you sure you want to delete this procurement product?"
      confirmBtnVariant="critical"
      confirmBtnText="Delete"
      loading={loading}
      onCancel={() => setSelectedProcurementProductId(null)}
      onConfirm={deleteProduct}
    />
  );
};
