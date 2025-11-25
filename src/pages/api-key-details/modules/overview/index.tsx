import { ENUM_API_KEY_STATUS } from "@types";
import { Chip, ChipTypes } from "@ui-kit";
import { capitalizeFirst } from "@utils";

import { OverviewItem } from "./overview-item";

export interface ItemProps {
  id: string;
  userId: string;
  key: string;
  name: string;
  scopes: number[];
  createdAt: string;
  modifiedAt: string;
  lastActivity: string;
  status: number;
  rps: number;
}

interface OverViewProps {
  item?: ItemProps;
}

const formatted = (date?: string) => {
  if (date) {
    return date
      .replace("T", " ")
      .replace("Z", "")
      .replace(/(\.\d{2})\d+/, "$1");
  }

  return "";
};

export const OverView = ({ item }: OverViewProps) => {
  return (
    <div className="flex h-auto flex-wrap gap-4 rounded-xl border bg-background-subtle p-4">
      <OverviewItem title="Name" value={item?.name} />
      <OverviewItem title="RPS" value={item?.rps} />
      <OverviewItem title="Key" value={item?.key} />
      <OverviewItem title="Last Activity" value={formatted(item?.lastActivity)} className="!border-r-0" />
      {item?.status && (
        <OverviewItem
          title="Status"
          value={
            <Chip
              title={capitalizeFirst(ENUM_API_KEY_STATUS[item?.status])}
              type={ENUM_API_KEY_STATUS[item?.status] as ChipTypes}
              size="small"
            />
          }
        />
      )}
    </div>
  );
};
