import { emptyProduct, emptyProfile, ProductFormValues, ProfileFormValues } from "@forms";
import { create } from "zustand";

export type DialogTypes =
  | "unsavedChanges"
  | "confirm"
  | "filters"
  | "warning"
  | "status"
  | "delete"
  | "resetPassword"
  | "profile"
  | "banCustomer"
  | "closeCustomer"
  | "product";

export type DialogMode = "" | "create" | "update";

interface IPermissionDetails {
  id: number;
  name: string;
  key: string;
  description: string;
  status: number;
}

interface IPermission {
  description: string;
  permissions: IPermissionDetails[];
}

export interface IPermissionSection {
  id: number;
  parentId: number;
  Name: string;
  readPermissions: IPermission | null;
  createPermissions: IPermission | null;
  editPermissions: IPermission | null;
  deletePermissions: IPermission | null;
  exportPermissions: IPermission | null;
  permissionTypeIds?: number[];
  subPermissionSections?: IPermissionSection[];
}

export interface IRole {
  id: number;
  name: string;
  description: string;
  status: number;
  permissionSections: IPermissionSection[];
}

interface IUser {
  id: number;
  identityId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  userRoles: IRole[];
}

export interface IAuth {
  isLoading: boolean;
  check: boolean;
  user: IUser | null;
  avatar?: string;
}

export interface IResetPasswordData {
  email: string;
  username: string;
  phone: string;
}

interface IStoreState {
  auth: IAuth;
  setAuth: (value: IAuth) => void;
  isAppSidebarMini: boolean;
  setIsAppSidebarMini: (value: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
  drawerType: DialogTypes | null;
  setDrawerType: (type: DialogTypes | null) => void;
  dialogs: DialogTypes[];
  setDialogs: (dialogs: DialogTypes[]) => void;
  dialogMode: DialogMode;
  setDialogMode: (mode: DialogMode) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  product: ProductFormValues;
  setProduct: (value: ProductFormValues) => void;
  profile: ProfileFormValues;
  setProfile: (value: ProfileFormValues) => void;
  resetPasswordData: IResetPasswordData | null;
  setResetPasswordData: (value: IResetPasswordData | null) => void;
  selectedCompleteOrderId: string | null;
  setSelectedCompleteOrderId: (value: string | null) => void;
  selectedConfirmReturnOrderId: string | null;
  setSelectedConfirmReturnOrderId: (value: string | null) => void;
}

export const useStore = create<IStoreState>((set) => ({
  auth: {
    isLoading: false,
    check: false,
    user: null,
  },
  setAuth: (auth) => set({ auth }),
  isAppSidebarMini: true,
  setIsAppSidebarMini: (isAppSidebarMini) => set({ isAppSidebarMini }),
  drawerOpen: false,
  setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
  drawerType: null,
  setDrawerType: (drawerType) => set({ drawerType }),
  dialogs: [],
  setDialogs: (dialogs) => set({ dialogs }),
  dialogMode: "",
  setDialogMode: (dialogMode) => set({ dialogMode }),
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),
  selectedIds: [],
  setSelectedIds: (selectedIds) => set({ selectedIds }),
  product: emptyProduct,
  setProduct: (product) => set({ product }),
  profile: emptyProfile,
  setProfile: (profile) => set({ profile }),
  resetPasswordData: null,
  setResetPasswordData: (resetPasswordData) => set({ resetPasswordData }),
  selectedCompleteOrderId: null,
  setSelectedCompleteOrderId: (selectedCompleteOrderId) => set({ selectedCompleteOrderId }),
  selectedConfirmReturnOrderId: null,
  setSelectedConfirmReturnOrderId: (selectedConfirmReturnOrderId) => set({ selectedConfirmReturnOrderId }),
}));
