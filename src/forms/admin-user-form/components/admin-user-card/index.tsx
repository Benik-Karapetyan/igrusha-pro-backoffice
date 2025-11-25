import { FC, useMemo } from "react";

import { ReadOnlyField, StatusDialog } from "@containers";
import { useCheckPermission } from "@hooks";
import { useStore } from "@store";
import { ISelectItem } from "@types";
import { Switch } from "@ui-kit";

import { AdminUserFormValues } from "../../AdminUserForm.consts";

interface AdminUserCardProps {
  user: AdminUserFormValues;
  roles: ISelectItem[];
  orgLevels: ISelectItem[];
  brands: ISelectItem[];
  onStatusUpdate: () => void;
}

export const AdminUserCard: FC<AdminUserCardProps> = ({ user, roles, orgLevels, brands, onStatusUpdate }) => {
  const setDialogs = useStore((s) => s.setDialogs);
  const setSelectedElementEnabled = useStore((s) => s.setSelectedElementEnabled);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const { checkPermission } = useCheckPermission();

  const roleNames = useMemo(() => {
    const roleNames: string[] = [];

    user.roleIds?.forEach((id) => {
      const role = roles.find((role) => role.id === id);

      if (role) roleNames.push(role.name as string);
    });

    return roleNames;
  }, [roles, user.roleIds]);

  const orgLevel = useMemo(
    () => orgLevels.find((o) => o.id === user.orgLevelId)?.name as string,
    [orgLevels, user.orgLevelId]
  );

  const brand = useMemo(() => brands.find((b) => b.id === user.brandId)?.name as string, [brands, user.brandId]);

  const handleClick = () => {
    setSelectedElementEnabled(user.status === 1);
    setSelectedIds([user.id as number]);
    setDialogs(["status"]);
  };

  return (
    <div className="flex w-full flex-wrap gap-5">
      <ReadOnlyField label="First Name" value={user.firstName} className="w-[calc(50%_-_10px)]" />
      <ReadOnlyField label="Last Name" value={user.lastName} className="w-[calc(50%_-_10px)]" />
      <ReadOnlyField label="Email Address" value={user.email} className="w-[calc(50%_-_10px)]" />
      <ReadOnlyField label="Phone Number" value={user.phone} className="w-[calc(50%_-_10px)]" />
      <ReadOnlyField label="Address" value={user.address} className="w-[calc(50%_-_10px)]" />
      <ReadOnlyField label="Roles" value={roleNames} className="w-[calc(50%_-_10px)]" />
      <ReadOnlyField label="Org Level" value={orgLevel} className="w-[calc(50%_-_10px)]" />
      <ReadOnlyField label="Brand" value={brand} className="w-[calc(50%_-_10px)]" />

      {checkPermission("admin_user_update") && (
        <Switch checked={user.status === 1} disabled={user.status === 3} onClick={handleClick} />
      )}
      <StatusDialog
        title="Admin User"
        updateUrl="users"
        description="They will be able to access the system again."
        onSuccess={onStatusUpdate}
      />
    </div>
  );
};
