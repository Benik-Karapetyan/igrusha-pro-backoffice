import { CopyToClipboard, CustomerStatusCell, TableActionsCell, TableDateCell } from "@containers";
import { useNavigate } from "@tanstack/react-router";
import { HeaderItem, TableItem } from "@ui-kit";

export const usePeerToPeerOrderHeaders = () => {
  const navigate = useNavigate();

  const headers: HeaderItem[] = [
    {
      text: "order id",
      value: (item: TableItem) =>
        typeof item.identityId === "string" && (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.identityId}>
              {item.identityId}
            </div>
            <CopyToClipboard text={item.identityId} size="iconSmall" />
          </div>
        ),
      width: 120,
      maxWidth: 120,
    },
    {
      text: "offer id",
      value: (item: TableItem) =>
        typeof item.offerId === "string" && (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.offerId}>
              {item.offerId}
            </div>
            <CopyToClipboard text={item.offerId} size="iconSmall" />
          </div>
        ),
      width: 120,
      maxWidth: 120,
    },
    {
      text: "buyer id",
      value: (item: TableItem) =>
        typeof item.offerId === "string" && (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.offerId}>
              {item.offerId}
            </div>
            <CopyToClipboard text={item.offerId} size="iconSmall" />
          </div>
        ),
      width: 120,
      maxWidth: 120,
    },
    {
      text: "seller id",
      value: (item: TableItem) =>
        typeof item.offerId === "string" && (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.offerId}>
              {item.offerId}
            </div>
            <CopyToClipboard text={item.offerId} size="iconSmall" />
          </div>
        ),
      width: 120,
      maxWidth: 120,
    },
    { text: "type", value: "type", width: 120, maxWidth: 120 },
    { text: "price", value: "price", width: 120, maxWidth: 120 },
    { text: "crypto amount", value: "cryptoAmount", width: 160, maxWidth: 160 },
    { text: "payment methods", value: "paymentMethods", width: 160, maxWidth: 160 },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <CustomerStatusCell status={item.status} />,
    },
    {
      text: "creation date",
      value: (item) => (
        <div className="flex items-center gap-1">
          {item.createDate && typeof item.createDate === "string" && <TableDateCell date={item.createDate} />}
        </div>
      ),
    },
    {
      text: "last status update",
      value: (item) => (
        <div className="flex items-center gap-1">
          {item.lastStatusUpdate && typeof item.lastStatusUpdate === "string" && (
            <TableDateCell date={item.lastStatusUpdate} />
          )}
          <TableActionsCell
            actions={["watch"]}
            item={item}
            onWatch={(item) => navigate({ to: "/peer-to-peer-orders/$id", params: { id: String(item.id) } })}
            className="ml-auto"
          />
        </div>
      ),
    },
  ];

  return {
    headers,
  };
};
