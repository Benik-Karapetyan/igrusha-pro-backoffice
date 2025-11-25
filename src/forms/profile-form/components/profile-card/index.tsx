import { FC, useMemo } from "react";

import { ReadOnlyField } from "@containers";
import { ISelectItem } from "@types";

import { ProfileFormValues } from "../../ProfileForm.consts";

interface ProfileCardProps {
  user: ProfileFormValues;
  roles: ISelectItem[];
  orgLevels: ISelectItem[];
  brands: ISelectItem[];
}

export const ProfileCard: FC<ProfileCardProps> = ({ user, roles, orgLevels, brands }) => {
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
    </div>
  );
};
