import { useState } from "react";

import { useToast } from "@hooks";
import { mdiRestore } from "@mdi/js";
import { api } from "@services";
import { Button, Icon, TextField } from "@ui-kit";

interface EntryFormProps {
  productId: string;
}

export const EntryForm = ({ productId }: EntryFormProps) => {
  const toast = useToast();
  const [quantity, setQuantity] = useState<string | number>("");

  const restoreEntries = async () => {
    try {
      await api.post(`/products/backfill-entry-temp`, {
        productId,
        quantity,
      });
      toast.success("Entries restored successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-end gap-2">
      <TextField
        label="Entry"
        placeholder="Enter entry"
        value={quantity}
        onChange={(e) => setQuantity(+e.target.value)}
      />
      <Button variant="ghost" size="iconSmall" className="mb-1" onClick={() => restoreEntries()}>
        <Icon name={mdiRestore} color="icon-primary" />
      </Button>
    </div>
  );
};
