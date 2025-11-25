import { FC } from "react";

import { mdiWalletOutline } from "@mdi/js";
import { Icon } from "@ui-kit";

interface NoBalancesProps {
  title: string;
  firstText: string;
  secondText: string;
}

export const NoBalances: FC<NoBalancesProps> = ({ title, firstText, secondText }) => {
  return (
    <div className="flex h-[calc(100vh_-_400px)] min-h-[400px] items-center justify-center p-5">
      <div className="flex max-w-[501px] -translate-y-10 flex-col items-center gap-6 text-center text-foreground-muted-more">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-3xl border">
          <Icon name={mdiWalletOutline} color="current" size={36} />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold">{title}</h3>

          <p>{firstText}</p>
          <p>{secondText}</p>
        </div>
      </div>
    </div>
  );
};
