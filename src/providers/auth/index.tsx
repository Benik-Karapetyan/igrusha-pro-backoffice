import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";

import { api } from "@services";
import { IPermissionSection, IRole, useStore } from "@store";

interface IAuthContextType {
  auth: boolean;
  setAuth: (auth: boolean) => void;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<boolean>(!!localStorage.getItem("accessToken"));
  const setStateAuth = useStore((s) => s.setAuth);
  const setAuthPermissions = useStore((s) => s.setAuthPermissions);
  const canFetch = useRef(true);

  const getCurrentUser = useCallback(async () => {
    try {
      setStateAuth({ isLoading: true, check: false, user: null });

      const token = localStorage.getItem("accessToken");

      if (token) {
        const { data } = await api.get("/bo/api/auth/me");

        if (data.id) {
          setAuth(true);
          setStateAuth({ isLoading: false, check: true, user: data });

          const flattenedRoles = data.userRoles
            ?.flatMap((role: IRole) => role.permissionSections)
            .filter((role: IRole) => role.status === 1) as IPermissionSection[];

          const mergedRoles: IPermissionSection[] = [];

          flattenedRoles.forEach((fr) => {
            const index = mergedRoles.findIndex((mr) => mr.id === fr.id);
            if (index !== -1) {
              const role = { ...mergedRoles[index] };

              fr.subPermissionSections?.forEach((sps) => {
                if (role.subPermissionSections) {
                  const index = role.subPermissionSections.findIndex((rsps) => rsps.id === sps.id);
                  if (index !== -1) {
                    const subRole = { ...role.subPermissionSections[index] };
                    sps.subPermissionSections?.forEach((ssps) => {
                      if (subRole.subPermissionSections) {
                        const index = subRole.subPermissionSections.findIndex((sr) => sr.id === ssps.id);

                        if (index !== -1) {
                          const subRolePermissions = { ...subRole.subPermissionSections[index] };

                          if (!subRolePermissions.readPermissions)
                            subRolePermissions.readPermissions = ssps.readPermissions;
                          if (!subRolePermissions.editPermissions)
                            subRolePermissions.editPermissions = ssps.editPermissions;
                          if (!subRolePermissions.createPermissions)
                            subRolePermissions.createPermissions = ssps.createPermissions;
                          if (!subRolePermissions.deletePermissions)
                            subRolePermissions.deletePermissions = ssps.deletePermissions;

                          if (subRolePermissions.permissionTypeIds && ssps.permissionTypeIds) {
                            ssps.permissionTypeIds.forEach((id) => {
                              if (!subRolePermissions.permissionTypeIds?.includes(id))
                                subRolePermissions.permissionTypeIds?.push(id);
                            });
                          }

                          subRole.subPermissionSections[index] = subRolePermissions;
                        } else {
                          subRole.subPermissionSections?.push(ssps);
                        }
                      }
                    });
                  } else {
                    role.subPermissionSections?.push(sps);
                  }
                }
              });

              mergedRoles.splice(index, 1, role);
            } else {
              mergedRoles.push(fr);
            }
          });

          setAuthPermissions(mergedRoles);
        }
      }
    } catch (err) {
      console.error("Error", err);
    }
  }, [setStateAuth, setAuthPermissions]);

  useEffect(() => {
    if (canFetch.current) {
      canFetch.current = false;
      getCurrentUser();
    }
  }, [getCurrentUser]);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
