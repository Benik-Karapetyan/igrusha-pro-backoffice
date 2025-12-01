import { FC, useState } from "react";

import { useToast } from "@hooks";
import { api } from "@services";
import { useStore } from "@store";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@ui-kit";
import { getErrorMessage } from "@utils";

interface DeleteDialogProps {
  title: string;
  deleteUrl: string;
  onSuccess: () => void;
}

export const DeleteDialog: FC<DeleteDialogProps> = ({ title, deleteUrl, onSuccess }) => {
  const toast = useToast();
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const product = useStore((s) => s.product);
  const [loading, setLoading] = useState(false);

  const deleteElement = async () => {
    try {
      setLoading(true);
      await api.put(`/uploads/delete-images/`, {
        gallery: product.gallery.map((image) => new URL(image).pathname.slice(1)),
      });
      await api.delete(`/${deleteUrl}/${product._id}`);
      setDialogs([]);
      toast.success(`${title} has been deleted`);
      onSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogs.includes("delete")} onOpenChange={(value) => setDialogs(value ? ["delete"] : [])}>
      <DialogContent className="w-[400px] text-center">
        <DialogHeader>
          <DialogTitle className="w-full text-center">Delete {title}</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-center">Are you sure you want to delete this element?</DialogDescription>

        <DialogFooter className="gap-4">
          <Button variant="ghost" onClick={() => setDialogs([])}>
            Cancel
          </Button>
          <Button loading={loading} onClick={deleteElement}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
