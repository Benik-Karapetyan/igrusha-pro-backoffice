import { useCallback } from "react";

import { IPermissionSection, useStore } from "@store";

export const useCheckPermission = () => {
  const authPermissions = useStore((s) => s.authPermissions);

  const checkPermission = useCallback(
    (permissionKey: string) => {
      if (authPermissions.length) {
        const findPermission = (sections: IPermissionSection[]) => {
          for (const section of sections) {
            if (
              section.readPermissions?.permissions?.some((p) => p.key === permissionKey) ||
              section.editPermissions?.permissions?.some((p) => p.key === permissionKey) ||
              section.createPermissions?.permissions?.some((p) => p.key === permissionKey) ||
              section.deletePermissions?.permissions?.some((p) => p.key === permissionKey)
            ) {
              return true;
            }

            if (section.subPermissionSections?.length && findPermission(section.subPermissionSections)) {
              return true;
            }
          }
          return false;
        };

        return findPermission(authPermissions);
      } else {
        return true;
      }
    },
    [authPermissions]
  );

  return {
    checkPermission,
  };
};
