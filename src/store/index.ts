import {
  emptyExpense,
  emptyOrder,
  emptyProduct,
  emptyProfile,
  ExpenseFormValues,
  OrderFormValues,
  ProductFormValues,
  ProfileFormValues,
} from "@forms";
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
  | "closeCustomer";

export type DrawerTypes = "product" | "expense" | "order";

export type DialogMode = "" | "create" | "update";

export interface IAddress {
  street: string;
  building: number;
  entrance?: number;
  floor?: number;
  apartment: number;
  zip?: string;
}

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: IAddress;
  isAdmin: boolean;
}

export interface IAuth {
  isLoading: boolean;
  check: boolean;
  user: IUser | null;
  avatar?: string;
}

interface IStoreState {
  auth: IAuth;
  setAuth: (value: IAuth) => void;
  isAppSidebarMini: boolean;
  setIsAppSidebarMini: (value: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (value: boolean) => void;
  drawerType: DrawerTypes | null;
  setDrawerType: (type: DrawerTypes | null) => void;
  dialogs: DialogTypes[];
  setDialogs: (dialogs: DialogTypes[]) => void;
  dialogMode: DialogMode;
  setDialogMode: (mode: DialogMode) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
  profile: ProfileFormValues;
  setProfile: (value: ProfileFormValues) => void;
  product: ProductFormValues;
  setProduct: (value: ProductFormValues) => void;
  order: OrderFormValues;
  setOrder: (value: OrderFormValues) => void;
  expense: ExpenseFormValues;
  setExpense: (value: ExpenseFormValues) => void;
  selectedExpenseId: string | null;
  setSelectedExpenseId: (value: string | null) => void;
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
  isAppSidebarMini: false,
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
  profile: emptyProfile,
  setProfile: (profile) => set({ profile }),
  product: emptyProduct,
  setProduct: (product) => set({ product }),
  order: emptyOrder,
  setOrder: (order) => set({ order }),
  expense: emptyExpense,
  setExpense: (expense) => set({ expense }),
  selectedExpenseId: null,
  setSelectedExpenseId: (selectedExpenseId) => set({ selectedExpenseId }),
  selectedCompleteOrderId: null,
  setSelectedCompleteOrderId: (selectedCompleteOrderId) => set({ selectedCompleteOrderId }),
  selectedConfirmReturnOrderId: null,
  setSelectedConfirmReturnOrderId: (selectedConfirmReturnOrderId) => set({ selectedConfirmReturnOrderId }),
}));
