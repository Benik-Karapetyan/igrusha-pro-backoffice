import { FC, PropsWithChildren } from "react";

import { mdiFilterVariant } from "@mdi/js";
import { useStore } from "@store";
import { Button, Icon } from "@ui-kit";

import { FiltersDialog } from "../filters-dialog";

interface FilterBarProps {
  loading?: boolean;
  serverError?: boolean;
  filtersCount: number;
  onFilterBtnClick?: () => void;
}

export const FilterBar: FC<PropsWithChildren<FilterBarProps>> = ({
  children,
  loading,
  serverError,
  filtersCount,
  onFilterBtnClick,
}) => {
  const setDialogs = useStore((s) => s.setDialogs);

  return (
    <>
      <Button
        variant="ghost"
        className="relative"
        size="icon"
        onClick={() => {
          setDialogs(["filters"]);
          onFilterBtnClick?.();
        }}
      >
        <Icon name={mdiFilterVariant} color="icon-default" dense />
        {!!filtersCount && (
          <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-state-destructive-foreground text-xs text-white">
            {filtersCount}
          </div>
        )}
      </Button>

      <FiltersDialog loading={!!loading} serverError={!!serverError}>
        {children}
      </FiltersDialog>
    </>
  );
};
