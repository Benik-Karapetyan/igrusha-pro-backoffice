import { useState } from "react";

import { ConfirmDialog } from "@components";
import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { getErrorMessage } from "@utils";

interface ProductPublishDialogProps {
  onSuccess: () => void;
}

export const ProductPublishDialog = ({ onSuccess }: ProductPublishDialogProps) => {
  const toast = useToast();
  const selectedPublishProduct = useStore((s) => s.selectedPublishProduct);
  const setSelectedPublishProduct = useStore((s) => s.setSelectedPublishProduct);
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    try {
      setLoading(true);

      await api.patch(`/products/${selectedPublishProduct?._id}/publish`, {
        isPublished: !selectedPublishProduct?.isPublished,
      });

      onSuccess();
      setSelectedPublishProduct(null);
      toast.success(
        `Product has been successfully ${selectedPublishProduct?.isPublished ? "unpublished" : "published"}`
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!selectedPublishProduct}
      onOpenChange={() => setSelectedPublishProduct(null)}
      title={`${selectedPublishProduct?.isPublished ? "Unpublish" : "Publish"} Product`}
      text={`Are you sure you want to ${selectedPublishProduct?.isPublished ? "unpublish" : "publish"} this product?`}
      onCancel={() => setSelectedPublishProduct(null)}
      confirmBtnText={selectedPublishProduct?.isPublished ? "Unpublish" : "Publish"}
      confirmBtnVariant={selectedPublishProduct?.isPublished ? "critical" : "default"}
      loading={loading}
      onConfirm={handlePublish}
    />
  );
};
