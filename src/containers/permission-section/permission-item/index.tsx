import { FC } from "react";

import { IPermissionSection } from "@store";

interface PermissionItemProps {
  section: IPermissionSection;
}

export const PermissionItem: FC<PermissionItemProps> = ({ section }) => {
  return (
    <div className="flex border-b px-5 py-3">
      <div className="w-[18%]"></div>
      <div className="w-[18%]"></div>
      <div className="flex w-[18%] items-center">{section.Name}</div>
      <div className="flex w-[46%] flex-col gap-1">
        {section.readPermissions && (
          <div className="flex">
            <div className="min-w-[80px]">Read</div>
            <div>{section.readPermissions.description}</div>
          </div>
        )}
        {section.createPermissions && (
          <div className="flex">
            <div className="min-w-[80px]">Create</div>
            <div>{section.createPermissions.description}</div>
          </div>
        )}
        {section.editPermissions && (
          <div className="flex">
            <div className="min-w-[80px]">Update</div>
            <div>{section.editPermissions.description}</div>
          </div>
        )}
        {section.deletePermissions && (
          <div className="flex">
            <div className="min-w-[80px]">Delete</div>
            <div>{section.deletePermissions.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};
