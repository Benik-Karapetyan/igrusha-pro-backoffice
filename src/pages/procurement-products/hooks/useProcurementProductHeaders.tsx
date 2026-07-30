import { TableSwitchCell } from "@containers";
import { ProcurementProductFormValues } from "@forms";
import { mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { Button, HeaderItem, Icon, TableItem } from "@ui-kit";
import { calculateVolumetricWeight, deleteIcon, editIcon, formatCurrency } from "@utils";
import { format } from "date-fns";

export const useProcurementProductHeaders = (amdRate: number) => {
  const setProcurementProduct = useStore((s) => s.setProcurementProduct);
  const setSelectedProcurementProduct = useStore((s) => s.setSelectedProcurementProduct);
  const setSelectedProcurementProductId = useStore((s) => s.setSelectedProcurementProductId);

  const handleIsOrderedClick = (item: TableItem) => {
    setSelectedProcurementProduct({
      _id: item._id as string,
      isOrdered: item.isOrdered as boolean,
    });
  };

  const handleEdit = (item: TableItem) => {
    setProcurementProduct(item as unknown as ProcurementProductFormValues);
  };

  const handleDelete = (item: TableItem) => {
    setSelectedProcurementProductId(item._id as string);
  };

  const headers: HeaderItem[] = [
    {
      text: "product image",
      value: (item) =>
        typeof item.url === "string" && item.image && typeof item.image === "string" ? (
          <a href={item.url} target="_blank" className="block py-3">
            <img src={item.image} alt="" className="h-[124px] min-h-[124px] w-[124px] min-w-[124px] object-cover" />
          </a>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 148,
      maxWidth: 148,
    },
    {
      text: "price",
      value: (item) =>
        typeof item.price === "number" ? (
          <div className="flex flex-col gap-1">
            <div>{formatCurrency(item.price, "USD", "en-US")}</div>
            <div>{formatCurrency(item.price * amdRate)}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "carton quantity",
      value: "cartonQuantity",
    },
    {
      text: "carton weight",
      value: (item) =>
        typeof item.cartonWeight === "number" ? `${item.cartonWeight} kg` : <Icon name={mdiMinus} dense />,
    },
    {
      text: "carton size",
      value: (item) =>
        typeof item.cartonSize === "object" &&
        typeof item.cartonSize.length === "number" &&
        typeof item.cartonSize.width === "number" &&
        typeof item.cartonSize.height === "number" ? (
          `${item.cartonSize.length} x ${item.cartonSize.width} x ${item.cartonSize.height}`
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "quantity",
      value: "quantity",
    },
    {
      text: "delivery inside cost",
      value: "deliveryInsideCost",
    },
    {
      text: "delivery inside duration",
      value: "deliveryInsideDuration",
    },
    {
      text: "payment fee",
      value: (item) =>
        typeof item.paymentFee === "number" ? (
          <div className="flex flex-col gap-1">
            <div>{formatCurrency(item.paymentFee, "USD", "en-US")}</div>
            <div>{formatCurrency(item.paymentFee * amdRate)}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "brand",
      value: "brand",
    },
    {
      text: "seller",
      value: (item) =>
        typeof item.seller === "string" ? (
          <div className="whitespace-pre-wrap">{item.seller}</div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      maxWidth: 200,
    },
    {
      text: "total cost",
      value: (item) =>
        typeof item.price === "number" && typeof item.quantity === "number" ? (
          <div className="flex flex-col gap-1">
            <div>{formatCurrency(item.price * item.quantity, "USD", "en-US")}</div>
            <div>{formatCurrency(item.price * item.quantity * amdRate)}</div>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "total weight",
      value: (item) =>
        typeof item.quantity === "number" &&
        typeof item.cartonQuantity === "number" &&
        typeof item.cartonWeight === "number" ? (
          <div>{(item.quantity / item.cartonQuantity) * item.cartonWeight} kg</div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "total volumetric weight",
      value: (item) =>
        typeof item.quantity === "number" &&
        typeof item.cartonQuantity === "number" &&
        typeof item.cartonSize === "object" &&
        typeof item.cartonSize.length === "number" &&
        typeof item.cartonSize.width === "number" &&
        typeof item.cartonSize.height === "number" ? (
          <div>
            {calculateVolumetricWeight(
              item.cartonSize.length,
              item.cartonSize.width,
              item.cartonSize.height,
              item.quantity,
              item.cartonQuantity
            ).toFixed(2)}{" "}
            kg
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
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
      text: "is ordered",
      value: (item) =>
        typeof item.isOrdered === "boolean" || typeof item.isOrdered === "undefined" ? (
          <TableSwitchCell checked={!!item.isOrdered} onClick={() => handleIsOrderedClick(item)} />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
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
