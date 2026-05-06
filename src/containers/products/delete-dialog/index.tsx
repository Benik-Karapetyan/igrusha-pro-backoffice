import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface DeleteProductDialogProps {
  onSuccess: () => void;
}

export const DeleteProductDialog = ({ onSuccess }: DeleteProductDialogProps) => {
  const toast = useToast();
  const selectedProductId = useStore((s) => s.selectedProductId);
  const setSelectedProductId = useStore((s) => s.setSelectedProductId);
  const [loading, setLoading] = useState(false);

  const deleteProduct = async () => {
    try {
      setLoading(true);

      await api.delete(`/products/${selectedProductId}`);

      setSelectedProductId(null);
      toast.success("Product deleted successfully");
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedProductId}
      onOpenChange={() => setSelectedProductId(null)}
      title="Delete Product"
      text="Are you sure you want to delete this product?"
      confirmBtnVariant="critical"
      confirmBtnText="Delete"
      loading={loading}
      onConfirm={deleteProduct}
    />
  );
};
