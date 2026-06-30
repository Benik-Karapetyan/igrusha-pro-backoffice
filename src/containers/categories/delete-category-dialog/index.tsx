import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface DeleteCategoryDialogProps {
  onSuccess: () => void;
}

export const DeleteCategoryDialog = ({ onSuccess }: DeleteCategoryDialogProps) => {
  const toast = useToast();
  const selectedCategoryId = useStore((s) => s.selectedCategoryId);
  const setSelectedCategoryId = useStore((s) => s.setSelectedCategoryId);
  const [loading, setLoading] = useState(false);

  const deleteCategory = async () => {
    try {
      setLoading(true);

      await api.delete(`/categories/${selectedCategoryId}`);
      setSelectedCategoryId(null);
      toast.success("Category deleted successfully");
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedCategoryId}
      onOpenChange={() => setSelectedCategoryId(null)}
      title="Delete Category"
      text="Are you sure you want to delete this category?"
      onCancel={() => setSelectedCategoryId(null)}
      confirmBtnText="Delete"
      confirmBtnVariant="critical"
      loading={loading}
      onConfirm={deleteCategory}
    />
  );
};
