import { CopyToClipboard, CustomerStatusCell, TableActionsCell } from "@containers";
import { useNavigate } from "@tanstack/react-router";
import { HeaderItem, TableItem } from "@ui-kit";

export const usePeerToPeerOfferHeaders = () => {
  const navigate = useNavigate();

  const headers: HeaderItem[] = [
    {
      text: "customer id",
      value: (item: TableItem) =>
        typeof item.identityId === "string" && (
          <div className="flex items-center p-0.5">
            <div className="overflow-hidden text-ellipsis" title={item.identityId}>
              {item.identityId}
            </div>
            <CopyToClipboard text={item.identityId} size="iconSmall" />
          </div>
        ),
      width: 160,
      maxWidth: 160,
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
      width: 160,
      maxWidth: 160,
    },
    { text: "email", value: "email", width: 210, maxWidth: 210 },
    { text: "nickname", value: "nickname", width: 120, maxWidth: 120 },
    { text: "type", value: "type", width: 100, maxWidth: 100 },
    { text: "price", value: "price", width: 100, maxWidth: 100 },
    { text: "crypto/fiat pair", value: "cryptoFiatPair" },
    { text: "available amount", value: "availableAmount" },
    { text: "min/max amount", value: "minMaxAmount" },
    {
      text: "status",
      value: (item) => typeof item?.status === "number" && <CustomerStatusCell status={item.status} />,
    },
    {
      text: "payment methods",
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
    },
  ];

  return {
    headers,
  };
};
