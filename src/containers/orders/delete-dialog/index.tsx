import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface DeleteOrderDialogProps {
  onSuccess: () => void;
}

export const DeleteOrderDialog = ({ onSuccess }: DeleteOrderDialogProps) => {
  const toast = useToast();
  const selectedOrderId = useStore((s) => s.selectedOrderId);
  const setSelectedOrderId = useStore((s) => s.setSelectedOrderId);
  const [loading, setLoading] = useState(false);

  const deleteOrder = async () => {
    try {
      setLoading(true);

      await api.delete(`/orders/${selectedOrderId}`);

      setSelectedOrderId(null);
      toast.success("Expense deleted successfully");
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedOrderId}
      onOpenChange={() => setSelectedOrderId(null)}
      title="Delete Order"
      text="Are you sure you want to delete this order?"
      confirmBtnVariant="critical"
      confirmBtnText="Delete"
      loading={loading}
      onConfirm={deleteOrder}
    />
  );
};
