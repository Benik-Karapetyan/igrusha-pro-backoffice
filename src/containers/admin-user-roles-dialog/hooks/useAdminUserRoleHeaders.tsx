import { TableDateCell, TableStatusCell } from "@containers";
import { mdiMinus } from "@mdi/js";
import { HeaderItem, Icon } from "@ui-kit";

export const useAdminUserRoleHeaders = () => {
  const headers: HeaderItem[] = [
    { text: "name", value: "name", width: 150 },
    { text: "description", value: "description", width: 150 },
    {
      text: "created at",
      value: (item) =>
        typeof item?.createdAt === "string" ? <TableDateCell date={item.createdAt} /> : <Icon name={mdiMinus} dense />,
    },
    {
      text: "updated at",
      value: (item) =>
        typeof item?.updatedAt === "string" ? <TableDateCell date={item.updatedAt} /> : <Icon name={mdiMinus} dense />,
    },
    {
      text: "status",
      value: (item) => typeof item.status === "number" && <TableStatusCell status={item.status} />,
    },
  ];

  return {
    headers,
  };
};
