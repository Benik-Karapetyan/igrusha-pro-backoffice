import { TableDateCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { HeaderItem, Icon } from "@ui-kit";

export const useIpAddressHeaders = () => {
  const headers: HeaderItem[] = [
    {
      text: "IP address",
      value: "ipAddress",
      width: "25%",
    },
    {
      text: "country",
      value: "country",
      width: "25%",
    },
    {
      text: "usage count",
      value: "count",
      width: "25%",
    },
    {
      text: "last time used date",
      value: (item) =>
        typeof item?.usedAt === "string" ? <TableDateCell date={item.usedAt} /> : <Icon name={mdiMinus} dense />,
      width: "25%",
    },
  ];

  return {
    headers,
  };
};
