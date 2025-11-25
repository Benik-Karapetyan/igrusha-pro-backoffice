import { TableActionsCell, TableStatusCell, TableSwitchCell } from "@containers";
import { ProductFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { HeaderItem, Icon, TableItem } from "@ui-kit";

export const useProductHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setProduct = useStore((s) => s.setProduct);
  const setSelectedIds = useStore((s) => s.setSelectedIds);

  const handleEdit = (item: TableItem) => {
    const locationIds = (item.locations as unknown as { id: number }[]).map((l) => l.id);
    setProduct({ ...item, locationIds } as ProductFormValues);
    setDialogMode("update");
    setDialogs(["product"]);
  };

  const handleDelete = (id: number) => {
    setSelectedIds([id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "product id", value: "id" },
    { text: "name", value: "name" },
    { text: "description", value: "description" },
    {
      text: "available regions",
      value: (item) =>
        Array.isArray(item.locations) && item.locations.length ? item.locations : <Icon name={mdiMinus} dense />,
    },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <TableStatusCell status={item.status} />,
    },
    {
      text: "",
      value: (item) => (
        <TableActionsCell actions={["edit", "delete"]} item={item} onEdit={handleEdit} onDelete={handleDelete} />
      ),
      width: 80,
    },
  ];

  headers.splice(5, 0, {
    text: "enabled",
    value: (item) =>
      typeof item?.status === "number" && <TableSwitchCell status={item.status} id={item.id as number} />,
  });

  return {
    headers,
  };
};
