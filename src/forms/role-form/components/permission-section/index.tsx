import { FC, useMemo, useState } from "react";

import { mdiChevronDown } from "@mdi/js";
import { CheckedState } from "@radix-ui/react-checkbox";
import { IPermissionSection } from "@store";
import { Checkbox, Icon } from "@ui-kit";
import { cn } from "@utils";

import { RolePermissionSection } from "../../RoleForm.consts";
import { PermissionSubSection } from "./permission-sub-section";

interface PermissionSectionProps {
  section: IPermissionSection;
  selectedPermissionSections: RolePermissionSection[];
  readOnly: boolean;
  onPermissionChange: (value: RolePermissionSection) => void;
  onPermissionsChange: (value: RolePermissionSection[]) => void;
}

export const PermissionSection: FC<PermissionSectionProps> = ({
  section,
  selectedPermissionSections,
  readOnly,
  onPermissionChange,
  onPermissionsChange,
}) => {
  const [open, setOpen] = useState(false);

  const permissionTypeIds = useMemo(() => {
    let ids: number[] = [];

    section.subPermissionSections?.forEach((section) => {
      section.subPermissionSections?.forEach((subSection) => {
        const subPermissionTypeIds = selectedPermissionSections.find(
          (sps) => sps.permissionSectionId === subSection.id
        )?.permissionTypeIds;

        if (subPermissionTypeIds) {
          ids = [...ids, ...subPermissionTypeIds];
        }
      });
    });

    return ids.filter((value, index, self) => self.indexOf(value) === index);
  }, [selectedPermissionSections, section.subPermissionSections]);

  const readDisabled = useMemo(
    () =>
      section.subPermissionSections?.every((sps) =>
        sps.subPermissionSections?.every((childSps) => !childSps.readPermissions?.permissions[0])
      ) ||
      permissionTypeIds.includes(1) ||
      permissionTypeIds.includes(2) ||
      permissionTypeIds.includes(3),
    [section.subPermissionSections, permissionTypeIds]
  );

  const updateDisabled = useMemo(
    () =>
      section.subPermissionSections?.every((sps) =>
        sps.subPermissionSections?.every((childSps) => !childSps.editPermissions?.permissions[0])
      ) ||
      permissionTypeIds.includes(2) ||
      permissionTypeIds.includes(3),
    [section.subPermissionSections, permissionTypeIds]
  );

  const createDisabled = useMemo(
    () =>
      section.subPermissionSections?.every((sps) =>
        sps.subPermissionSections?.every((childSps) => !childSps.createPermissions?.permissions[0])
      ) || permissionTypeIds.includes(3),
    [section.subPermissionSections, permissionTypeIds]
  );

  const deleteDisabled = useMemo(
    () =>
      section.subPermissionSections?.every((sps) =>
        sps.subPermissionSections?.every((childSps) => !childSps.deletePermissions?.permissions[0])
      ),
    [section.subPermissionSections]
  );

  const handlePermissionsChange = (checked: CheckedState, permissionNumber: number) => {
    if (permissionTypeIds.includes(permissionNumber) && !checked) {
      const rolePermissionSections: RolePermissionSection[] = [];

      section.subPermissionSections?.forEach((subSection) => {
        subSection.subPermissionSections?.forEach((subSectionChild) => {
          const selectedSubSection = selectedPermissionSections.find(
            (sps) => sps.permissionSectionId === subSectionChild.id
          );

          if (selectedSubSection) {
            rolePermissionSections.push({
              permissionSectionId: selectedSubSection.permissionSectionId,
              permissionTypeIds: selectedSubSection.permissionTypeIds.filter((id) => id > permissionNumber),
            });
          }
        });
      });

      onPermissionsChange(rolePermissionSections);
    } else if (!permissionTypeIds.includes(permissionNumber) && checked) {
      const rolePermissionSections: RolePermissionSection[] = [];

      section.subPermissionSections?.forEach((subSection) => {
        subSection.subPermissionSections?.forEach((subSectionChild) => {
          const newPermissionTypeIds = [];
          for (let i = 0; i <= permissionNumber; i++) {
            if (subSectionChild.permissionTypeIds?.includes(i)) newPermissionTypeIds.push(i);
          }

          rolePermissionSections.push({
            permissionSectionId: subSectionChild.id,
            permissionTypeIds: newPermissionTypeIds,
          });
        });
      });

      onPermissionsChange(rolePermissionSections);
    }
  };

  return (
    <div className="flex flex-col gap-7 text-sm font-semibold text-foreground-muted">
      <div key={section.Name} className="flex gap-2">
        <div
          className="flex h-10 min-w-[calc(18%_-_41px_/_6)] max-w-[calc(18%_-_41px_/_6)] cursor-pointer select-none items-center border px-3"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Icon name={mdiChevronDown} className={cn(open && "rotate-180 transition-transform")} />
          <span title={section.Name} className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {section.Name}
          </span>
        </div>
        <div className="h-10 min-w-[calc(18%_-_41px_/_6)] max-w-[calc(18%_-_41px_/_6)] border" />
        <div className="h-10 min-w-[calc(18%_-_41px_/_6)] max-w-[calc(18%_-_41px_/_6)] border" />
        <div className="flex h-10 min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] select-none items-center justify-center border">
          <Checkbox
            label="Read"
            checked={permissionTypeIds.includes(0)}
            readOnly={readOnly}
            disabled={readDisabled}
            onCheckedChange={(checked) => handlePermissionsChange(checked, 0)}
          />
        </div>
        <div className="flex h-10 min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] select-none items-center justify-center border">
          <Checkbox
            label="Update"
            checked={permissionTypeIds.includes(1)}
            readOnly={readOnly}
            disabled={updateDisabled}
            onCheckedChange={(checked) => handlePermissionsChange(checked, 1)}
          />
        </div>
        <div className="flex h-10 min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] select-none items-center justify-center border">
          <Checkbox
            label="Create"
            checked={permissionTypeIds.includes(2)}
            readOnly={readOnly}
            disabled={createDisabled}
            onCheckedChange={(checked) => handlePermissionsChange(checked, 2)}
          />
        </div>
        <div className="flex h-10 min-w-[calc(11.5%_-_41px_/_6)] max-w-[calc(11.5%_-_41px_/_6)] select-none items-center justify-center border">
          <Checkbox
            label="Delete"
            checked={permissionTypeIds.includes(3)}
            readOnly={readOnly}
            disabled={deleteDisabled}
            onCheckedChange={(checked) => handlePermissionsChange(checked, 3)}
          />
        </div>
      </div>

      {open &&
        section.subPermissionSections?.map((subSection, i) => (
          <PermissionSubSection
            key={i}
            section={subSection}
            selectedPermissionSections={selectedPermissionSections}
            readOnly={readOnly}
            onPermissionChange={onPermissionChange}
            onPermissionsChange={onPermissionsChange}
          />
        ))}
    </div>
  );
};
