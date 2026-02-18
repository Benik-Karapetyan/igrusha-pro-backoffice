import { TableSwitchCell } from "@containers";
import { emptyOrder, ProductFormValues } from "@forms";
import { mdiMinus, mdiPackageVariantClosedPlus } from "@mdi/js";
import { useStore } from "@store";
import { Button, HeaderItem, Icon, TableItem } from "@ui-kit";
import { deleteIcon, editIcon, formatCurrency } from "@utils";

export const useProductHeaders = () => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setProduct = useStore((s) => s.setProduct);
  const setOrder = useStore((s) => s.setOrder);
  const setSelectedPublishProduct = useStore((s) => s.setSelectedPublishProduct);

  const handleOrderClick = (item: TableItem) => {
    setOrder({
      ...emptyOrder,
      items: [
        {
          productId: item._id as string,
          image: (item.gallery as unknown as string[])[0] as string,
          quantity: 1,
          price: item.price as number,
          finalPrice: "",
          discount: item.discount as number,
        },
      ],
    });
    setDialogMode("create");
    setDrawerType("order");
  };

  const handleEdit = (item: TableItem) => {
    setProduct({
      ...item,
      relatedProducts: Array.isArray(item.relatedProducts) ? item.relatedProducts.map((product) => product._id) : [],
      ageRange: item.ageRange
        ? (item.ageRange as { to?: number }).to
          ? item.ageRange
          : { from: (item.ageRange as { from: number }).from, to: "" }
        : { from: "", to: "" },
      size: item.size || { length: "", width: "", height: "" },
      boxSize: item.boxSize || { length: "", width: "", height: "" },
      detailsCount: item.detailsCount || "",
    } as unknown as ProductFormValues);
    setDialogMode("update");
    setDrawerType("product");
  };

  const handleDelete = (item: TableItem) => {
    setProduct({
      ...item,
    } as unknown as ProductFormValues);
    setDialogs(["delete"]);
  };

  const handlePublishClick = (item: TableItem) => {
    setSelectedPublishProduct({
      _id: item._id as string,
      isPublished: item.isPublished as boolean,
    });
  };

  const headers: HeaderItem[] = [
    { text: "product number", value: "productNumber", width: 135, maxWidth: 135 },
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
      width: 174,
      maxWidth: 174,
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
    },
    { text: "rating", value: "rating" },
    { text: "review count", value: "reviewCount" },
    {
      text: "cost",
      value: (item) => (typeof item.cost === "number" ? formatCurrency(item.cost) : <Icon name={mdiMinus} dense />),
    },
    {
      text: "price",
      value: (item) => (typeof item.price === "number" ? formatCurrency(item.price) : <Icon name={mdiMinus} dense />),
    },
    {
      text: "discount",
      value: (item) => (typeof item.discount === "number" ? `${item.discount}%` : <Icon name={mdiMinus} dense />),
    },
    { text: "number in stock", value: "numberInStock" },
    {
      text: "published",
      value: (item) =>
        typeof item.isPublished === "boolean" ? (
          <TableSwitchCell checked={item.isPublished} onClick={() => handlePublishClick(item)} />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "",
      value: (item) => (
        <div className="flex justify-end gap-3 p-1">
          <Button variant="ghost" size="iconSmall" onClick={() => handleOrderClick(item)}>
            <Icon name={mdiPackageVariantClosedPlus} color="icon-primary" />
          </Button>

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
