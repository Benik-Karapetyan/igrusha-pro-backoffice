import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface BrandPublishDialogProps {
  onSuccess: () => void;
}

export const BrandPublishDialog = ({ onSuccess }: BrandPublishDialogProps) => {
  const toast = useToast();
  const selectedPublishBrand = useStore((s) => s.selectedPublishBrand);
  const setSelectedPublishBrand = useStore((s) => s.setSelectedPublishBrand);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    try {
      setLoading(true);

      await api.patch(`/brands/${selectedPublishBrand?._id}/publish`, {
        isPublished: !selectedPublishBrand?.isPublished,
      });

      onSuccess();
      setSelectedPublishBrand(null);
      toast.success(`Brand has been successfully ${selectedPublishBrand?.isPublished ? "unpublished" : "published"}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedPublishBrand}
      onOpenChange={() => setSelectedPublishBrand(null)}
      title={`${selectedPublishBrand?.isPublished ? "Unpublish" : "Publish"} Brand`}
      text={`Are you sure you want to ${selectedPublishBrand?.isPublished ? "unpublish" : "publish"} this brand?`}
      onCancel={() => setSelectedPublishBrand(null)}
      confirmBtnText={selectedPublishBrand?.isPublished ? "Unpublish" : "Publish"}
      confirmBtnVariant={selectedPublishBrand?.isPublished ? "critical" : "default"}
      loading={loading}
      onConfirm={handlePublish}
    />
  );
};
