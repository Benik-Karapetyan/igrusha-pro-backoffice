import { OrderStatusCell } from "@components";
import { mdiCancel, mdiCheck, mdiKeyboardReturn, mdiMinus } from "@mdi/js";
import { useStore } from "@store";
import { ENUM_ORDER_STATUS } from "@types";
import { Button, HeaderItem, Icon, TableItem } from "@ui-kit";
import { formatCurrency } from "@utils";
import { format } from "date-fns";

export const useOrderHeaders = () => {
  const setSelectedCompleteOrderId = useStore((s) => s.setSelectedCompleteOrderId);
  const setSelectedConfirmReturnOrderId = useStore((s) => s.setSelectedConfirmReturnOrderId);

  const handleCompleteOrder = (item: TableItem) => {
    setSelectedCompleteOrderId(item._id as string);
  };

  const handleReturnOrder = (item: TableItem) => {
    setSelectedConfirmReturnOrderId(item._id as string);
  };

  const headers: HeaderItem[] = [
    {
      text: "order number",
      value: (item) =>
        typeof item.orderNumber === "string" ? `# ${item.orderNumber}` : <Icon name={mdiMinus} dense />,
      width: 160,
      maxWidth: 160,
    },
    {
      text: "product image",
      value: (item) =>
        Array.isArray(item.items) && Array.isArray(item.items[0].productId.gallery) ? (
          <img
            src={item.items[0].productId.gallery[0]}
            alt={(item.items[0].productId.name as { en: string }).en as string}
            className="h-[150px] min-h-[150px] w-[150px] min-w-[150px] object-cover"
          />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "status",
      value: (item) => typeof item.status === "string" && <OrderStatusCell status={item.status as ENUM_ORDER_STATUS} />,
    },
    {
      text: "total amount",
      value: (item) =>
        typeof item.totalAmount === "number" ? formatCurrency(item.totalAmount) : <Icon name={mdiMinus} dense />,
    },
    {
      text: "delivery to",
      value: (item) =>
        typeof item.userId === "object" ? (
          <div>
            <div>{`${item.userId.firstName} ${item.userId.lastName}`}</div>
            {typeof item.userId.address === "object" && (
              <div>
                {`${item.userId.address.street} ${item.userId.address.building}, ${item.userId.address.apartment ? `app ${item.userId.address.apartment}` : ""}`}
              </div>
            )}
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "created at",
      value: (item) =>
        typeof item.createdAt === "string" ? (
          format(item.createdAt, "dd.MM.yyyy HH:mm")
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "delivered at",
      value: (item) =>
        typeof item.deliveredAt === "string" ? (
          format(item.deliveredAt, "dd.MM.yyyy HH:mm")
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "payment method",
      value: (item) => (typeof item.paymentMethod === "string" ? item.paymentMethod : <Icon name={mdiMinus} dense />),
    },
    {
      text: "order instructions",
      value: "orderInstructions",
    },
    {
      text: "",
      value: (item) => (
        <div className="flex justify-end gap-3 p-1">
          {item.status === ENUM_ORDER_STATUS.OnTheWay && (
            <>
              <Button variant="ghost" size="iconSmall" onClick={() => handleCompleteOrder(item)}>
                <Icon name={mdiCheck} color="icon-success" />
              </Button>

              <Button variant="ghost" size="iconSmall" onClick={() => console.log("Barev")}>
                <Icon name={mdiCancel} color="icon-error" dense />
              </Button>
            </>
          )}

          {item.status === ENUM_ORDER_STATUS.ReturnPending && (
            <Button variant="ghost" size="iconSmall" onClick={() => handleReturnOrder(item)}>
              <Icon name={mdiKeyboardReturn} color="icon-error" dense />
            </Button>
          )}
        </div>
      ),
      width: 80,
    },
  ];

  return {
    headers,
  };
};
