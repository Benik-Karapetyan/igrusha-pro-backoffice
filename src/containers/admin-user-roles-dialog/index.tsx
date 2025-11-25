import { mdiClose } from "@mdi/js";
import { useStore } from "@store";
import { Button, DataTable, Dialog, DialogContent, DialogHeader, DialogTitle, Icon, TableItem } from "@ui-kit";

import { useAdminUserRoleHeaders } from "./hooks/useAdminUserRoleHeaders";

export const AdminUserRolesDialog = () => {
  const dialogs = useStore((s) => s.dialogs);
  const setDialogs = useStore((s) => s.setDialogs);
  const { headers } = useAdminUserRoleHeaders();
  const selectedAdminUserRoles = useStore((s) => s.selectedAdminUserRoles);

  const handleClose = () => {
    setDialogs([]);
  };

  return (
    <Dialog
      open={dialogs.includes("adminUserRoles")}
      onOpenChange={(value) => setDialogs(value ? ["adminUserRoles"] : [])}
    >
      <DialogContent className="min-w-[1000px] text-center" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>User Roles</DialogTitle>

          <Button variant="icon" size="icon" className="-mr-3" onClick={handleClose}>
            <Icon name={mdiClose} />
          </Button>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl border border-b-0">
          <div className="overflow-auto">
            <DataTable headers={headers} items={selectedAdminUserRoles as unknown as TableItem[]} hideFooter />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
