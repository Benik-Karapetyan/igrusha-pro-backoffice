import { FC, useMemo } from "react";

import { CheckedState } from "@radix-ui/react-checkbox";
import { IPermissionSection } from "@store";
import { Checkbox } from "@ui-kit";

import { RolePermissionSection } from "../../../RoleForm.consts";

interface PermissionItemProps {
  section: IPermissionSection;
  selectedPermissionSections: RolePermissionSection[];
  readOnly: boolean;
  onPermissionChange: (value: RolePermissionSection) => void;
}

export const PermissionItem: FC<PermissionItemProps> = ({
  section,
  selectedPermissionSections,
  readOnly,
  onPermissionChange,
}) => {
  const permissionTypeIds = useMemo(() => {
    return selectedPermissionSections.find((sps) => sps.permissionSectionId === section.id)?.permissionTypeIds || [];
  }, [selectedPermissionSections, section.id]);

  const readDisabled = useMemo(
    () =>
      !section.readPermissions?.permissions[0] ||
      permissionTypeIds.includes(1) ||
      permissionTypeIds.includes(2) ||
      permissionTypeIds.includes(3),
    [section.readPermissions?.permissions, permissionTypeIds]
  );

  const updateDisabled = useMemo(
    () => !section.editPermissions?.permissions[0] || permissionTypeIds.includes(2) || permissionTypeIds.includes(3),
    [section.editPermissions?.permissions, permissionTypeIds]
  );

  const createDisabled = useMemo(
    () => !section.createPermissions?.permissions[0] || permissionTypeIds.includes(3),
    [section.createPermissions?.permissions, permissionTypeIds]
  );

  const deleteDisabled = useMemo(
    () => !section.deletePermissions?.permissions[0],
    [section.deletePermissions?.permissions]
  );

  const handlePermissionChange = (checked: CheckedState, permissionNumber: number) => {
    if (permissionTypeIds?.includes(permissionNumber) && !checked) {
      onPermissionChange({
        permissionSectionId: section.id,
        permissionTypeIds: permissionTypeIds.filter((id) => id > permissionNumber),
      });
    } else if (!permissionTypeIds.includes(permissionNumber) && checked) {
      const newPermissionTypeIds = [];

      for (let i = 0; i <= permissionNumber; i++) {
        if (section.permissionTypeIds?.includes(i)) newPermissionTypeIds.push(i);
      }

      onPermissionChange({
        permissionSectionId: section.id,
        permissionTypeIds: newPermissionTypeIds,
      });
    }
  };

  return (
    <div className="flex gap-2">
      <div className="h-10 min-w-[calc(18%_-_41px_/_6)] max-w-[calc(18%_-_41px_/_6)] border" />
      <div className="h-10 min-w-[calc(18%_-_41px_/_6)] max-w-[calc(18%_-_41px_/_6)] border" />
      <div className="flex h-10 min-w-[calc(18%_-_41px_/_6)] max-w-[calc(18%_-_41px_/_6)] select-none items-center border px-3">
        <span title={section.Name} className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
          {section.Name}
        </span>
      </div>

      <div className="flex h-10 min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] select-none items-center justify-center border">
        <Checkbox
          label="Read"
          checked={permissionTypeIds?.includes(0)}
          readOnly={readOnly}
          disabled={readDisabled}
          onCheckedChange={(checked) => handlePermissionChange(checked, 0)}
        />
      </div>
      <div className="flex h-10 min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] select-none items-center justify-center border">
        <Checkbox
          label="Update"
          checked={permissionTypeIds?.includes(1)}
          readOnly={readOnly}
          disabled={updateDisabled}
          onCheckedChange={(checked) => handlePermissionChange(checked, 1)}
        />
      </div>
      <div className="flex h-10 min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] select-none items-center justify-center border">
        <Checkbox
          label="Create"
          checked={permissionTypeIds?.includes(2)}
          readOnly={readOnly}
          disabled={createDisabled}
          onCheckedChange={(checked) => handlePermissionChange(checked, 2)}
        />
      </div>
      <div className="flex h-10 min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] select-none items-center justify-center border">
        <Checkbox
          label="Delete"
          checked={permissionTypeIds?.includes(3)}
          readOnly={readOnly}
          disabled={deleteDisabled}
          onCheckedChange={(checked) => handlePermissionChange(checked, 3)}
        />
      </div>
    </div>
  );
};
