import { useCallback, useMemo } from "react";

import { TableAction, TableActionsCell, TableDateCell } from "@containers";
import { useToast } from "@hooks";
import { mdiMinus } from "@mdi/js";
import { api } from "@services";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { ENUM_API_KEY_STATUS } from "@types";
import { Chip, ChipTypes, HeaderItem, Icon, TableItem, Typography } from "@ui-kit";
import { capitalizeFirst, getErrorMessage } from "@utils";

export const useApiKeysHeaders = () => {
  const navigate = useNavigate();
  const router = useRouter();
  const toast = useToast();

  const openInNewTab = useCallback(
    async (id: string) => {
      try {
        const { data } = await api.get(`/bo/api/customers/getBy/${id}`);

        const customerUrl = router.buildLocation({
          to: "/customers/$id",
          params: { id: String(data.id) },
        }).href;

        window.open(customerUrl, "_blank");
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    },
    [router, toast]
  );

  const actions = useMemo(() => {
    const tableActions: TableAction[] = [];
    tableActions.push("watch");

    return tableActions;
  }, []);

  const handleWatch = (item: TableItem) => {
    navigate({ to: `/api-keys/${item.userId}`, search: { key: String(item.key) } });
  };

  const headers: HeaderItem[] = [
    { text: "API Name", value: "name" },
    {
      text: "UID",
      value: (item) =>
        typeof item.userId === "string" ? (
          <div
            className="cursor-pointer overflow-hidden text-ellipsis"
            onClick={() => (typeof item.userId === "string" ? openInNewTab(item.userId) : undefined)}
          >
            <Typography variant="link" color="link" className="underline">
              {item.userId}
            </Typography>
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
      width: 160,
      maxWidth: 160,
    },
    {
      text: "RPS",
      value: "rps",
    },
    {
      text: "Status",
      value: (item) =>
        typeof item?.status === "number" && (
          <div className="py-1.5">
            <Chip
              title={capitalizeFirst(ENUM_API_KEY_STATUS[item.status])}
              type={ENUM_API_KEY_STATUS[item.status] as ChipTypes}
              className="my-1.5"
              size="small"
            />
          </div>
        ),
    },
    {
      text: "created at",
      value: (item) => typeof item?.createdAt === "string" && <TableDateCell date={item.createdAt} />,
    },
    {
      text: "modified at",
      value: (item) =>
        typeof item?.modifiedAt === "string" ? (
          <TableDateCell date={item.modifiedAt} />
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
    {
      text: "",
      value: (item) => {
        return <TableActionsCell actions={actions} item={item} onWatch={(item) => handleWatch(item)} />;
      },
      width: 48,
    },
  ];

  return { headers };
};
