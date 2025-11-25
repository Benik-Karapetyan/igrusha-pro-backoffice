import { CopyToClipboard, CustomerStatusCell, TableActionsCell } from "@containers";
import { useNavigate } from "@tanstack/react-router";
import { HeaderItem, TableItem } from "@ui-kit";

export const usePeerToPeerOfferHeaders = () => {
  const navigate = useNavigate();

  const headers: HeaderItem[] = [
    {
      text: "order ID",
      value: (item: TableItem) =>
        typeof item.identityId === "string" && (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.identityId}>
              {item.identityId}
            </div>
            <CopyToClipboard text={item.identityId} size="iconSmall" />
          </div>
        ),
      width: 200,
      maxWidth: 200,
    },
    {
      text: "taker ID",
      value: (item: TableItem) =>
        typeof item.offerId === "string" && (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.offerId}>
              {item.offerId}
            </div>
            <CopyToClipboard text={item.offerId} size="iconSmall" />
          </div>
        ),
      width: 200,
      maxWidth: 200,
    },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <CustomerStatusCell status={item.status} />,
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "crypto/fiat pair",
      value: (item: TableItem) =>
        typeof item.offerId === "string" && (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.offerId}>
              {item.offerId}
            </div>
            <CopyToClipboard text={item.offerId} size="iconSmall" />
          </div>
        ),
      width: "20%",
      maxWidth: "20%",
    },
    {
      text: "payment method used",
      value: (item) => (
        <div className="flex items-center gap-1">
          {Array.isArray(item.paymentMethods) && item.paymentMethods.join(", ")}
          <TableActionsCell
            actions={["watch"]}
            item={item}
            onWatch={(item) => navigate({ to: "/peer-to-peer-offers/$id", params: { id: String(item.id) } })}
            className="ml-auto"
          />
        </div>
      ),
      width: "20%",
      maxWidth: "20%",
    },
  ];

  return {
    headers,
  };
};
