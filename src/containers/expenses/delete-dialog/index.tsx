import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface DeleteExpenseDialogProps {
  onSuccess: () => void;
}

export const DeleteExpenseDialog = ({ onSuccess }: DeleteExpenseDialogProps) => {
  const toast = useToast();
  const selectedExpenseId = useStore((s) => s.selectedExpenseId);
  const setSelectedExpenseId = useStore((s) => s.setSelectedExpenseId);
  const [loading, setLoading] = useState(false);

  const deleteExpense = async () => {
    try {
      setLoading(true);

      await api.delete(`/expenses/${selectedExpenseId}`);

      setSelectedExpenseId(null);
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
      open={!!selectedExpenseId}
      onOpenChange={() => setSelectedExpenseId(null)}
      title="Delete Expense"
      text="Are you sure you want to delete this expense?"
      confirmBtnVariant="critical"
      confirmBtnText="Delete"
      loading={loading}
      onConfirm={deleteExpense}
    />
  );
};
