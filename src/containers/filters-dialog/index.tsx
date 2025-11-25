import { FC, PropsWithChildren } from "react";

import { mdiAlert } from "@mdi/js";
import { useStore } from "@store";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, Icon, ProgressCircular } from "@ui-kit";

interface FiltersDialogProps {
  loading: boolean;
  serverError: boolean;
}

export const FiltersDialog: FC<PropsWithChildren<FiltersDialogProps>> = ({ children, loading, serverError }) => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);

  const handleOpenChange = (value: boolean) => {
    setDialogs(value ? ["filters"] : []);
  };

  return (
    <Drawer open={dialogs.includes("filters")} onOpenChange={handleOpenChange}>
      <DrawerContent aria-describedby={undefined}>
        <DrawerHeader>
          <DrawerTitle>Filter</DrawerTitle>
        </DrawerHeader>

        {loading ? (
          <div className="flex h-[200px] -translate-y-5 items-center justify-center text-primary">
            <ProgressCircular indeterminate />
          </div>
        ) : serverError ? (
          <div className="flex items-center justify-center pt-10">
            <div className="flex -translate-y-10 flex-col items-center gap-6 text-center text-state-destructive-foreground">
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-3xl border border-state-destructive-foreground">
                <Icon name={mdiAlert} color="current" large />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-semibold">Unable to Retrieve Filters</h3>

                <p className="text-state-destructive-foreground-muted">We're having trouble retrieving filters.</p>
                <p className="text-state-destructive-foreground-muted">Please refresh to try again.</p>
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </DrawerContent>
    </Drawer>
  );
};
