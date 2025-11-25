import { HeaderItem, TableItem } from "@ui-kit";

export const useInvitedUserHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "UID",
      value: (item: TableItem) =>
        typeof item.id === "string" && (
          <div className="flex">
            <div className="w-[300px] overflow-hidden text-ellipsis" title={item.id}>
              {item.id}
            </div>
          </div>
        ),
      maxWidth: 160,
    },
    { text: "referral ID", value: "referrerUserId" },
    {
      text: "paid rewards",
      value: (item) => typeof item?.referralsCashbackPaid === "number" && <span>{item?.referralsCashbackPaid}</span>,
    },
    {
      text: "pending rewards",
      value: (item) =>
        typeof item?.referralsCashbackAvailable === "number" && <span>{item?.referralsCashbackAvailable}</span>,
    },
    {
      text: "ratio (me/friends)",
      value: (item) =>
        typeof item.selfCashbackRewardPercent === "number" &&
        typeof item.selfTradingFeeDiscountPercent === "number" && (
          <span>
            {item?.selfCashbackRewardPercent}%/{item?.selfTradingFeeDiscountPercent}%
          </span>
        ),
    },
  ];

  return {
    headers,
  };
};
