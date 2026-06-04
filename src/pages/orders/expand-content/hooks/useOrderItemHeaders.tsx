import { mdiMinus } from "@mdi/js";
import { Chip, HeaderItem, Icon, Rating } from "@ui-kit";
import { calculateDiscountedAmount, formatCurrency } from "@utils";

export const useOrderItemHeaders = () => {
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
      text: "quantity",
      value: "quantity",
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
      text: "total price",
      value: (item) =>
        typeof item.price === "number" && typeof item.quantity === "number" ? (
          typeof item.discount === "number" ? (
            formatCurrency(calculateDiscountedAmount(item.price, item.quantity, item.discount))
          ) : (
            formatCurrency(item.price * item.quantity)
          )
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
  ];

  return {
    headers,
  };
};
