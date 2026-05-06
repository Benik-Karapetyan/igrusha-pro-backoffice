import { TableSwitchCell } from "@containers";
import { emptyOrder, ProductFormValues } from "@forms";
import {
  mdiFileDocumentPlusOutline,
  mdiMinus,
  mdiPackageVariantClosedMinus,
  mdiPackageVariantClosedPlus,
} from "@mdi/js";
import { useStore } from "@store";
import { Button, Chip, HeaderItem, Icon, Rating, TableItem } from "@ui-kit";
import { deleteIcon, editIcon, formatCurrency } from "@utils";

export const useProductHeaders = () => {
  const setDrawerType = useStore((s) => s.setDrawerType);
  const setDialogMode = useStore((s) => s.setDialogMode);
  const setSelectedEntriesProductId = useStore((s) => s.setSelectedEntriesProductId);
  const setSelectedPublishProduct = useStore((s) => s.setSelectedPublishProduct);
  const setSelectedProductId = useStore((s) => s.setSelectedProductId);
  const setOrder = useStore((s) => s.setOrder);
  const setProduct = useStore((s) => s.setProduct);
  const setSelectedUtilizedProduct = useStore((s) => s.setSelectedUtilizedProduct);

  const handleEntriesClick = (item: TableItem) => {
    setSelectedEntriesProductId(item._id as string);
  };

  const handlePublishClick = (item: TableItem) => {
    setSelectedPublishProduct({
      _id: item._id as string,
      isPublished: item.isPublished as boolean,
    });
  };

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

  const handleUtilizedProductClick = (item: TableItem) => {
    setSelectedUtilizedProduct({
      productId: item._id as string,
      quantity: "",
      note: "",
      createdAt: "",
    });
    setDialogMode("create");
  };

  const handleEdit = (item: TableItem) => {
    setProduct({
      ...item,
      categories: Array.isArray(item.categories) ? item.categories.map((category) => category._id) : [],
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
    setSelectedProductId(item._id as string);
  };

  const headers: HeaderItem[] = [
    {
      text: "product image",
      value: (item) =>
        Array.isArray(item.gallery) && item.gallery.length ? (
          <img
            src={item.gallery[0]}
            alt={(item.name as { en: string }).en as string}
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
        typeof item.name === "object" &&
        typeof item.name.am === "string" &&
        typeof item.name.ru === "string" &&
        typeof item.name.en === "string" ? (
          <div className="flex flex-col gap-2 py-2">
            {typeof item.productNumber === "string" && (
              <div title={`# ${item.productNumber}`}># {item.productNumber}</div>
            )}
            {typeof item.urlName === "string" && <div title={item.urlName}>{item.urlName}</div>}

            <div>
              <div title={item.name.am}>{item.name.am}</div>
              <div title={item.name.ru}>{item.name.ru}</div>
              <div title={item.name.en}>{item.name.en}</div>
            </div>

            <Rating value={item.rating as number} reviewCount={item.reviewCount as number} />
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
        Array.isArray(item.categories) ? (
          <div className="flex flex-col gap-2">
            {item.categories.map((category) => (
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
        typeof item.gender === "string" ? (
          <Chip title={item.gender} size="small" type="future" className="capitalize" />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
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
    {
      text: "entries",
      value: (item) => (
        <div className="flex items-center gap-2">
          {item.entriesCount as number}

          <Button variant="ghost" size="iconSmall" onClick={() => handleEntriesClick(item)}>
            <Icon name={mdiFileDocumentPlusOutline} color="icon-primary" />
          </Button>
        </div>
      ),
    },
    { text: "sold", value: "soldCount" },
    { text: "utilized", value: "utilizedCount" },
    { text: "in stock", value: "numberInStock" },
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

          <Button variant="ghost" size="iconSmall" onClick={() => handleUtilizedProductClick(item)}>
            <Icon name={mdiPackageVariantClosedMinus} color="icon-primary" />
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
