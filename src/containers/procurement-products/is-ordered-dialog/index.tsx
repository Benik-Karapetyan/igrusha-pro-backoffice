import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface ProcurementProductIsOrderedDialogProps {
  onSuccess: () => void;
}

export const ProcurementProductIsOrderedDialog = ({ onSuccess }: ProcurementProductIsOrderedDialogProps) => {
  const toast = useToast();
  const selectedProcurementProduct = useStore((s) => s.selectedProcurementProduct);
  const setSelectedProcurementProduct = useStore((s) => s.setSelectedProcurementProduct);
  const [loading, setLoading] = useState(false);

  const handleIsOrderedChange = async () => {
    try {
      setLoading(true);

      await api.patch(`/procurement-products/${selectedProcurementProduct?._id}/is-ordered`, {
        isOrdered: !selectedProcurementProduct?.isOrdered,
      });

      onSuccess();
      setSelectedProcurementProduct(null);
      toast.success(`Product has been successfully ${selectedProcurementProduct?.isOrdered ? "unordered" : "ordered"}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedProcurementProduct}
      onOpenChange={() => setSelectedProcurementProduct(null)}
      title={`${selectedProcurementProduct?.isOrdered ? "Unorder" : "Order"} Product`}
      text={`Are you sure you want to ${selectedProcurementProduct?.isOrdered ? "unorder" : "order"} this product?`}
      onCancel={() => setSelectedProcurementProduct(null)}
      confirmBtnText={selectedProcurementProduct?.isOrdered ? "Unorder" : "Order"}
      confirmBtnVariant={selectedProcurementProduct?.isOrdered ? "critical" : "default"}
      loading={loading}
      onConfirm={handleIsOrderedChange}
    />
  );
};
