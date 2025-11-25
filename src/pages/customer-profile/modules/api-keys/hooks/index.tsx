import { mdiMinus } from "@mdi/js";
import { router } from "@routes";
import { ENUM_API_KEY_STATUS, ENUM_SCOPES } from "@types";
import { Chip, ChipTypes, HeaderItem, Icon, TableItem, Typography } from "@ui-kit";

export const useCustomerApiKeyHeaders = () => {
  const openInNewTab = (item: TableItem) => {
    const customerUrl = router.buildLocation({
      to: `/api-keys/${item?.userId}`,
      search: { key: String(item?.key) },
    }).href;
    window.open(customerUrl, "_blank");
  };

  const headers: HeaderItem[] = [
    {
      text: "key name",
      value: (item) => {
        return typeof item?.name === "string" ? (
          <div onClick={() => openInNewTab(item)}>
            <Typography variant="link" color="link" className="cursor-pointer underline">
              {item?.name}
            </Typography>
          </div>
        ) : (
          ""
        );
      },
    },
    {
      text: "key",
      value: "key",
      width: 160,
      maxWidth: 160,
    },
    {
      text: "API usage",
      value: (item) => {
        return Array.isArray(item?.scopes) ? (
          <Typography>{ENUM_SCOPES[item.scopes[item.scopes.length - 1]]}</Typography>
        ) : (
          <Icon name={mdiMinus} dense />
        );
      },
    },
    {
      text: "API RPS",
      value: "rps",
    },
    {
      text: "status",
      value: (item) =>
        typeof item?.status === "number" ? (
          <div className="py-1.5">
            <Chip
              size="small"
              className="capitalize"
              title={ENUM_API_KEY_STATUS[item.status]}
              type={ENUM_API_KEY_STATUS[item.status] as ChipTypes}
            />
          </div>
        ) : (
          <Icon name={mdiMinus} dense />
        ),
    },
  ];

  return { headers };
};
