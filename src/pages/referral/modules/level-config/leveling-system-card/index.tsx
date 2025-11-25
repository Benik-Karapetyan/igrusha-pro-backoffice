import { FC } from "react";

import { Button, DataTable, Icon, ProgressCircular, TableItem } from "@ui-kit";
import { editIcon } from "@utils";

import { useLevelingSystemHeaders } from "./hooks/useLevelingSystemHeaders";

interface LevelingSystemCardProps {
  loading: boolean;
  items: TableItem[];
  onSetLeveling: () => void;
}

export const LevelingSystemCard: FC<LevelingSystemCardProps> = ({ loading, items, onSetLeveling }) => {
  const { headers } = useLevelingSystemHeaders();

  return (
    <div className="flex grow flex-col gap-6 rounded-xl border bg-background-subtle p-4">
      <div className="flex items-center gap-4">
        <h3 className="grow font-semibold text-foreground-secondary">Leveling System</h3>

        <Button variant="ghost" size="iconSmall" onClick={onSetLeveling}>
          <Icon name={editIcon} />
        </Button>
      </div>

      {loading ? (
        <div className="flex h-full items-center justify-center text-primary">
          <ProgressCircular indeterminate />
        </div>
      ) : !items.length ? (
        <div className="flex flex-col items-center gap-3 py-5">
          <Button variant="outline" onClick={onSetLeveling}>
            Set Leveling
          </Button>

          <p className="text-center text-foreground-secondary">Information Text</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-t-md">
          <DataTable headers={headers} items={items} loading={loading} bordersVariant="dashed" hideFooter />
        </div>
      )}
    </div>
  );
};
