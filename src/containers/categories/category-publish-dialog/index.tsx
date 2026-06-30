import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface CategoryPublishDialogProps {
  onSuccess: () => void;
}

export const CategoryPublishDialog = ({ onSuccess }: CategoryPublishDialogProps) => {
  const toast = useToast();
  const selectedPublishCategory = useStore((s) => s.selectedPublishCategory);
  const setSelectedPublishCategory = useStore((s) => s.setSelectedPublishCategory);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    try {
      setLoading(true);

      await api.patch(`/categories/${selectedPublishCategory?._id}/publish`, {
        isPublished: !selectedPublishCategory?.isPublished,
      });

      onSuccess();
      setSelectedPublishCategory(null);
      toast.success(
        `Category has been successfully ${selectedPublishCategory?.isPublished ? "unpublished" : "published"}`
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedPublishCategory}
      onOpenChange={() => setSelectedPublishCategory(null)}
      title={`${selectedPublishCategory?.isPublished ? "Unpublish" : "Publish"} Category`}
      text={`Are you sure you want to ${selectedPublishCategory?.isPublished ? "unpublish" : "publish"} this category?`}
      onCancel={() => setSelectedPublishCategory(null)}
      confirmBtnText={selectedPublishCategory?.isPublished ? "Unpublish" : "Publish"}
      confirmBtnVariant={selectedPublishCategory?.isPublished ? "critical" : "default"}
      loading={loading}
      onConfirm={handlePublish}
    />
  );
};
