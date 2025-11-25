import { TableActionsCell } from "@containers";
import { router } from "@routes";
import { useStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { ENUM_REFERRAL_USER_STATUS } from "@types";
import {
  Chip,
  ChipTypes,
  HeaderItem,
  TableItem,
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Typography,
} from "@ui-kit";
import { capitalizeFirst } from "@utils";

export const useUserManagementHeaders = () => {
  const navigate = useNavigate();
  const setDialogs = useStore((s) => s.setDialogs);
  const setSelectedReferralUser = useStore((s) => s.setSelectedReferralLink);

  const handleBReferralStatusChange = (id: string, status: number) => {
    setDialogs(["blockReferralLink"]);
    setSelectedReferralUser({ id, status });
  };

  const openInNewTab = (item: TableItem) => {
    const customerUrl = router.buildLocation({
      to: `/customers/${item.customerId}`,
    }).href;
    window.open(customerUrl, "_blank");
  };

  const headers: HeaderItem[] = [
    {
      text: "UID",
      value: (item: TableItem) =>
        typeof item.id === "string" && (
          <div className="cursor-pointer overflow-hidden text-ellipsis" onClick={() => openInNewTab(item)}>
            <Typography variant="link" color="link" className="underline">
              {item.id}
            </Typography>
          </div>
        ),
      maxWidth: 160,
    },
    { text: "referral ID", value: "referrerUserId", maxWidth: 160 },
    {
      text: "referral level",
      value: (item) =>
        typeof item.level === "string" && <Chip title={`Level ${item.level}`} type="default" size="small" />,
    },
    {
      text: "total referral percent",
      value: (item) => `${item.selfMaxCommissionPercent}%`,
    },
    {
      text: "Status",
      value: (item) =>
        typeof item?.status === "number" && (
          <div className="py-1.5">
            <Chip
              title={capitalizeFirst(ENUM_REFERRAL_USER_STATUS[item.status])}
              type={ENUM_REFERRAL_USER_STATUS[item.status] as ChipTypes}
              size="small"
            />
          </div>
        ),
    },
    {
      text: "",
      value: (item) => (
        <div className="flex gap-3">
          <TableActionsCell
            actions={["block"]}
            item={item}
            onBlock={() => handleBReferralStatusChange(item.id as string, item.status as number)}
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <TableActionsCell
                  actions={["watch"]}
                  item={item}
                  onWatch={(item) => navigate({ to: "/referral/$id", params: { id: String(item.id) } })}
                />
              </TooltipTrigger>

              <TooltipContent side="top" align="center" sideOffset={10}>
                <TooltipArrow />

                <Typography variant="body-sm" color="inverse">
                  Details
                </Typography>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
      width: 84,
    },
  ];

  return {
    headers,
  };
};
