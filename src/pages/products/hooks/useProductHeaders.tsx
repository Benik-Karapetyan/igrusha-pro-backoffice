import { TableActionsCell, TableSwitchCell } from "@containers";
import { ProductFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { HeaderItem, Icon, TableItem } from "@ui-kit";

export const useProductHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setProduct = useStore((s) => s.setProduct);
  const setSelectedIds = useStore((s) => s.setSelectedIds);

  const handleEdit = (item: TableItem) => {
    setProduct({
      ...item,
      relatedProducts: Array.isArray(item.relatedProducts) ? item.relatedProducts.map((product) => product._id) : [],
    } as unknown as ProductFormValues);
    setDialogMode("update");
    setDrawerType("product");
  };

  const handleDelete = (_id: number) => {
    setSelectedIds([_id]);
    setDialogs(["delete"]);
  };

  const headers: HeaderItem[] = [
    { text: "product id", value: "_id", width: 160, maxWidth: 160 },
    {
      text: "product image",
      value: (item) =>
        Array.isArray(item.gallery) && item.gallery.length ? (
          <img
            src={item.gallery[0]}
            alt={(item.name as { en: string }).en as string}
            className="h-[150px] min-h-[150px] w-[150px] min-w-[150px] object-cover"
          />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "name",
      value: (item) =>
        typeof item.name === "object" &&
        typeof item.name.am === "string" &&
        typeof item.name.ru === "string" &&
        typeof item.name.en === "string" ? (
          <div className="flex flex-col gap-2 py-2">
            <div>{item.name.am}</div>
            <div>{item.name.ru}</div>
            <div>{item.name.en}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 250,
      maxWidth: 250,
    },
    {
      text: "description",
      value: (item) =>
        typeof item.description === "object" &&
        typeof item.description.am === "string" &&
        typeof item.description.ru === "string" &&
        typeof item.description.en === "string" ? (
          <div className="flex flex-col gap-2 py-2">
            <div>{item.description.am}</div>
            <div>{item.description.ru}</div>
            <div>{item.description.en}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 350,
      maxWidth: 350,
    },
    {
      text: "price",
      value: "price",
    },
    {
      text: "discount",
      value: (item) => (typeof item.discount === "number" ? `${item.discount}%` : <Icon name={mdiMinus} dense />),
    },
    { text: "number in stock", value: "numberInStock" },
    { text: "rating", value: "rating" },
    { text: "review count", value: "reviewCount" },
    {
      text: "published",
      value: (item) =>
        typeof item.isPublished === "boolean" ? (
          <TableSwitchCell status={item.published ? 1 : 0} id={item.id as number} />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "",
      value: (item) => (
        <TableActionsCell actions={["edit", "delete"]} item={item} onEdit={handleEdit} onDelete={handleDelete} />
      ),
      width: 80,
    },
  ];

  return {
    headers,
  };
};
