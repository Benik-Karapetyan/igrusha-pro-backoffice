// import { ProductFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { Button, Chip, HeaderItem, Icon, Rating, TableItem } from "@ui-kit";
import { deleteIcon, formatCurrency } from "@utils";
import { format } from "date-fns";

export const useUtilizedProductHeaders = () => {
  // const setDialogMode = useStore((s) => s.setDialogMode);
  const setSelectedUtilizedProductId = useStore((s) => s.setSelectedUtilizedProductId);
  // const setProduct = useStore((s) => s.setProduct);

  // const handleEdit = (item: TableItem) => {
  //   setProduct({
  //     productId: (item.productId as unknown as { _id: string })._id,
  //     quantity: item.quantity as string,
  //     note: item.note as string,
  //     createdAt: item.createdAt as string,
  //   } as unknown as ProductFormValues);
  //   setDialogMode("update");
  // };

  const handleDelete = (item: TableItem) => {
    setSelectedUtilizedProductId(item._id as string);
  };

  const headers: HeaderItem[] = [
    {
      text: "product image",
      value: (item) =>
        typeof item.productId === "object" && Array.isArray(item.productId.gallery) && item.productId.gallery.length ? (
          <img
            src={item.productId.gallery[0]}
            alt={(item.productId.name as { en: string }).en as string}
            className="h-[176px] min-h-[176px] w-[176px] min-w-[176px] object-cover"
          />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 200,
      maxWidth: 200,
    },
    {
      text: "name",
      value: (item) =>
        typeof item.productId === "object" &&
        typeof item.productId.name === "object" &&
        typeof item.productId.name.am === "string" &&
        typeof item.productId.name.ru === "string" &&
        typeof item.productId.name.en === "string" ? (
          <div className="flex flex-col gap-2 py-2">
            {typeof item.productId.productNumber === "string" && (
              <div title={`# ${item.productId.productNumber}`}># {item.productId.productNumber}</div>
            )}
            {typeof item.productId.urlName === "string" && (
              <div title={item.productId.urlName}>{item.productId.urlName}</div>
            )}

            <div>
              <div title={item.productId.name.am}>{item.productId.name.am}</div>
              <div title={item.productId.name.ru}>{item.productId.name.ru}</div>
              <div title={item.productId.name.en}>{item.productId.name.en}</div>
            </div>

            <Rating value={item.productId.rating as number} reviewCount={item.productId.reviewCount as number} />
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 400,
      maxWidth: 400,
    },
    {
      text: "categories",
      value: (item) =>
        typeof item.productId === "object" && Array.isArray(item.productId.categories) ? (
          <div className="flex flex-col gap-2">
            {item.productId.categories.map((category) => (
              <Chip key={category._id} title={category.name.en} size="small" type="future" />
            ))}
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "gender",
      value: (item) =>
        typeof item.productId === "object" && typeof item.productId.gender === "string" ? (
          <Chip title={item.productId.gender} size="small" type="future" className="capitalize" />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "cost",
      value: (item) =>
        typeof item.productId === "object" && typeof item.productId.cost === "number" ? (
          formatCurrency(item.productId.cost)
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "price",
      value: (item) =>
        typeof item.productId === "object" && typeof item.productId.price === "number" ? (
          formatCurrency(item.productId.price)
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "quantity",
      value: "quantity",
    },
    {
      text: "note",
      value: "note",
    },
    {
      text: "created at",
      value: (item) =>
        typeof item.createdAt === "string" ? (
          format(new Date(item.createdAt), "dd.MM.yyyy")
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "",
      value: (item) => (
        <div className="flex justify-end gap-3 p-1">
          {/* <Button variant="ghost" size="iconSmall" onClick={() => handleEdit(item)}>
            <Icon name={editIcon} color="icon-primary" />
          </Button> */}

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
