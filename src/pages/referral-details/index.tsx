import { useCallback, useEffect, useRef, useState } from "react";

import { BlockReferralLinkDialog } from "@containers";
import { useToast } from "@hooks";
import { TReferralDetailsTabValue } from "@routes";
import { api } from "@services";
import { useStore } from "@store";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { ENUM_REFERRAL_USER_STATUS_ACTION, TReferralUser } from "@types";
import { Button, Icon, TableItem, Tabs, TabsContent, TabsList, TabsTrigger } from "@ui-kit";
import { arrowLeftIcon, getErrorMessage } from "@utils";

import { InvitedUsers } from "./modules/invited-users";
import { TotalEarning } from "./modules/total-earning";
import { ReferralDetailsCard } from "./referral-details-card";

export const ReferralDetailsPage = () => {
  const navigate = useNavigate();
  const setDialogs = useStore((s) => s.setDialogs);
  const setSelectedReferralUser = useStore((s) => s.setSelectedReferralLink);
  const toast = useToast();
  const canFetch = useRef(true);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<TReferralUser | null>(null);

  const { id } = useParams({ from: "/auth/referral/$id" });
  const { tab } = useSearch({ from: "/auth/referral/$id" });

  const handleGoBack = () => navigate({ to: "/referral", search: { tab: "userManagement" } });

  const handleTabClick = (tab: TReferralDetailsTabValue) => {
    navigate({ to: "/referral/$id", params: { id }, search: { tab } });
  };

  const handleReferralStatusChange = (id: string, status: number) => {
    setDialogs(["blockReferralLink"]);
    setSelectedReferralUser({ id, status });
  };

  const getUser = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get(`/bo/api/referralUsers/${id}`);

      setItem(data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      void getUser();
    }
  }, [getUser]);

  return (
    <Tabs defaultValue={tab || "invitedUsers"}>
      <div className="flex h-14 items-center gap-4 rounded-tl-xl border-b bg-background-subtle px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="iconSmall" onClick={handleGoBack}>
            <Icon name={arrowLeftIcon} />
          </Button>

          <div className="ellipsis w-[151px] font-semibold">{id}</div>

          <div className="h-5 border-l border-stroke-divider"></div>
        </div>

        <TabsList>
          <TabsTrigger value="invitedUsers" onClick={() => handleTabClick("invitedUsers")}>
            Invited Users
          </TabsTrigger>
          <TabsTrigger value="totalEarning" onClick={() => handleTabClick("totalEarning")}>
            Total Earning
          </TabsTrigger>
        </TabsList>

        <Button
          variant={item?.status === "Blocked" ? "critical" : "default"} // finalize variant depend on status
          className="ml-auto"
          onClick={
            () =>
              handleReferralStatusChange(
                item?.id as string,
                item?.status
                  ? ENUM_REFERRAL_USER_STATUS_ACTION[item.status as keyof typeof ENUM_REFERRAL_USER_STATUS_ACTION]
                  : 1
              ) // customer-status in diff-apis are differ(string | number)
          }
        >
          {item?.status === "Blocked" ? "UnBlock" : "Block"} Referral Link
        </Button>
      </div>

      <BlockReferralLinkDialog onSuccess={getUser} />

      <div className="flex flex-col gap-4 p-4">
        <ReferralDetailsCard user={item} loading={loading} />

        <TabsContent value="invitedUsers">
          <InvitedUsers />
        </TabsContent>

        <TabsContent value="totalEarning">
          <TotalEarning items={item?.bonusesList as TableItem[]} loading={loading} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
