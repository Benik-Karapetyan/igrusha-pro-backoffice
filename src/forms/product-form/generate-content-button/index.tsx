import { useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { Button } from "@ui-kit";
import { getErrorMessage } from "@utils";

import { ProductFormValues } from "../product-form.consts";

interface GenerateContentButtonProps {
  productId: string;
  onContentGenerated: (
    data: Pick<
      ProductFormValues,
      "name" | "description" | "keyFeatures" | "whatsIncluded" | "material" | "poweredBy" | "size"
    >
  ) => void;
}

export const GenerateContentButton = ({ productId, onContentGenerated }: GenerateContentButtonProps) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleGenerateProductContent = async () => {
    try {
      setLoading(true);

      const { data } = await api.post(`/products/${productId}/generate-content`, {
        productId,
      });
      onContentGenerated(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" loading={loading} className="w-[209px]" onClick={handleGenerateProductContent}>
      Generate Product Content
    </Button>
  );
};
