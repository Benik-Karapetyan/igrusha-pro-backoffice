import { CopyToClipboard } from "@containers";
import { useRouter } from "@tanstack/react-router";
import { TReferralUser } from "@types";
import { Skeleton, Typography } from "@ui-kit";
import { cn, convertScientificToDecimal } from "@utils";

interface ReferralDetailsCardProps {
  user: TReferralUser | null;
  loading?: boolean;
}

export const ReferralDetailsCard = ({ user, loading }: ReferralDetailsCardProps) => {
  const router = useRouter();

  const handleRedirect = (id?: number) => {
    if (id) {
      const newUrl = router.buildLocation({
        to: "/customers/$id",
        params: { id: String(id) },
      }).href;

      window.open(newUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-background-subtle p-4">
      <div className="flex gap-4">
        <div className="flex w-[calc(25%_-_0.75rem)] flex-col gap-1.5 border-r border-dashed pr-1">
          {loading ? (
            <Skeleton className="h-full min-h-11" />
          ) : (
            <>
              <Typography variant="heading-5" color="secondary">
                Invited by UID
              </Typography>

              {user ? (
                <Typography
                  variant="heading-3"
                  color={user?.referrer?.id ? "link" : "primary"}
                  onClick={() => handleRedirect(user?.referrer?.customerId)}
                  className={cn("truncate underline-offset-4", {
                    "cursor-pointer text-primary underline": user?.referrer?.id,
                  })}
                >
                  {user?.referrer?.id || "No referrer"}
                </Typography>
              ) : (
                "-"
              )}
            </>
          )}
        </div>

        <div className="flex w-[calc(25%_-_0.75rem)] flex-col gap-1.5 border-r border-dashed pr-1">
          {loading ? (
            <Skeleton className="h-full min-h-11" />
          ) : (
            <>
              <Typography variant="heading-5" color="secondary">
                Total Invited Friends
              </Typography>

              <Typography variant="heading-3" color="primary">
                {user?.referralsCount || "-"}
              </Typography>
            </>
          )}
        </div>

        <div className="flex w-[calc(25%_-_0.75rem)] flex-col gap-1.5 border-r border-dashed pr-1">
          {loading ? (
            <Skeleton className="h-full min-h-11" />
          ) : (
            <>
              {" "}
              <Typography variant="heading-5" color="secondary">
                Verified Friends
              </Typography>
              <Typography variant="heading-3" color="primary">
                {user?.verifiedReferralsCount || "-"}
              </Typography>
            </>
          )}
        </div>

        <div className="flex w-[calc(25%_-_0.75rem)] flex-col gap-1.5 pr-1">
          {loading ? (
            <Skeleton className="h-full min-h-11" />
          ) : (
            <>
              <Typography variant="heading-5" color="secondary">
                Paid Rewards
              </Typography>
              <Typography variant="heading-3" color="primary">
                {user?.referralsCashbackPaid && user?.fiatCurrency
                  ? `${convertScientificToDecimal(user?.referralsCashbackPaid)} ${user?.fiatCurrency}`
                  : "-"}
              </Typography>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex w-[calc(25%_-_0.75rem)] flex-col gap-1.5 border-r border-dashed pr-1">
          {loading ? (
            <Skeleton className="h-full min-h-11" />
          ) : (
            <>
              <Typography variant="heading-5" color="secondary">
                Pending Rewards
              </Typography>

              <Typography variant="heading-3" color="primary">
                {user?.referralsCashbackAvailable && user?.fiatCurrency
                  ? `${convertScientificToDecimal(user?.referralsCashbackAvailable)} ${user?.fiatCurrency}`
                  : "-"}
              </Typography>
            </>
          )}
        </div>

        <div className="flex w-[calc(25%_-_0.75rem)] flex-col gap-1.5 border-r border-dashed pr-1">
          {loading ? (
            <Skeleton className="h-full min-h-11" />
          ) : (
            <>
              <Typography variant="heading-5" color="secondary">
                Referral Link
              </Typography>

              <div className="flex justify-between">
                <Typography variant="heading-3" color="primary" className="truncate">
                  {user?.referralLink || "-"}
                </Typography>
                {user?.referralLink && <CopyToClipboard text={user.referralLink} iconSize={24} />}
              </div>
            </>
          )}
        </div>

        <div className="flex w-[calc(25%_-_0.75rem)] flex-col gap-1.5 border-r border-dashed pr-1">
          {loading ? (
            <Skeleton className="h-full min-h-11" />
          ) : (
            <>
              <Typography variant="heading-5" color="secondary">
                Referral Code
              </Typography>

              <div className="flex justify-between">
                <Typography variant="heading-3" color="primary">
                  {user?.referralCode || "-"}
                </Typography>
                {user?.referralCode && <CopyToClipboard text={user.referralCode} iconSize={24} />}
              </div>
            </>
          )}
        </div>

        <div className="flex w-[calc(25%_-_0.75rem)] flex-col gap-1.5 pr-1">
          {loading ? (
            <Skeleton className="h-full min-h-11" />
          ) : (
            <>
              <Typography variant="heading-5" color="secondary">
                Referral Ration (me/friend)
              </Typography>

              {user ? (
                <Typography variant="heading-3" color="primary">
                  {user?.selfCashbackRewardPercent}%/{user?.selfTradingFeeDiscountPercent}%
                </Typography>
              ) : (
                "-"
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
