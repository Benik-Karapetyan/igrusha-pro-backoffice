import { EntryFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { Button, HeaderItem, Icon, TableItem } from "@ui-kit";
import { deleteIcon, editIcon } from "@utils";
import { format } from "date-fns";

export const useEntryHeaders = () => {
  const setSelectedEntryId = useStore((s) => s.setSelectedEntryId);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setEntry = useStore((s) => s.setEntry);

  const handleEdit = (item: TableItem) => {
    setEntry({
      ...item,
      createdAt: format(new Date(item.createdAt as string), "yyyy-MM-dd"),
    } as unknown as EntryFormValues);
    setDialogMode("update");
  };

  const handleDelete = (item: TableItem) => {
    setSelectedEntryId(item._id as string);
  };

  const headers: HeaderItem[] = [
    {
      text: "quantity",
      value: "quantity",
      width: 250,
      maxWidth: 250,
    },
    {
      text: "created at",
      value: (item) =>
        typeof item.createdAt === "string" ? (
          format(new Date(item.createdAt), "dd.MM.yyyy")
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 250,
      maxWidth: 250,
    },
    {
      text: "",
      value: (item) => (
        <div className="flex justify-end gap-3 p-1">
          <Button variant="ghost" size="iconSmall" onClick={() => handleEdit(item)}>
            <Icon name={editIcon} color="icon-primary" />
          </Button>

          <Button variant="ghost" size="iconSmall" onClick={() => handleDelete(item)}>
            <Icon name={deleteIcon} color="icon-error" />
          </Button>
        </div>
      ),
      width: 80,
    },
  ];

  return {
    headers,
  };
};
