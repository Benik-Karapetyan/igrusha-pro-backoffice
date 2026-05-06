import {
  CategoryFormValues,
  emptyCategory,
  emptyExpense,
  emptyOrder,
  emptyProduct,
  emptyProfile,
  EntryFormValues,
  ExpenseFormValues,
  OrderFormValues,
  ProductFormValues,
  ProfileFormValues,
  UtilizedProductFormValues,
} from "@forms";
import { ISelectedPublishProduct } from "@types";
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

export type DrawerTypes = "category" | "product" | "expense" | "order";

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
  category: CategoryFormValues;
  setCategory: (value: CategoryFormValues) => void;
  selectedCategoryId: string | null;
  setSelectedCategoryId: (value: string | null) => void;
  product: ProductFormValues;
  setProduct: (value: ProductFormValues) => void;
  selectedProductId: string | null;
  setSelectedProductId: (value: string | null) => void;
  selectedPublishProduct: ISelectedPublishProduct | null;
  setSelectedPublishProduct: (value: ISelectedPublishProduct | null) => void;
  selectedUtilizedProduct: UtilizedProductFormValues | null;
  setSelectedUtilizedProduct: (value: UtilizedProductFormValues | null) => void;
  selectedUtilizedProductId: string | null;
  setSelectedUtilizedProductId: (value: string | null) => void;
  entry: EntryFormValues | null;
  setEntry: (value: EntryFormValues | null) => void;
  selectedEntriesProductId: string | null;
  setSelectedEntriesProductId: (value: string | null) => void;
  selectedEntryId: string | null;
  setSelectedEntryId: (value: string | null) => void;
  order: OrderFormValues;
  setOrder: (value: OrderFormValues) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (value: string | null) => void;
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
  category: emptyCategory,
  setCategory: (category) => set({ category }),
  selectedCategoryId: null,
  setSelectedCategoryId: (selectedCategoryId) => set({ selectedCategoryId }),
  product: emptyProduct,
  setProduct: (product) => set({ product }),
  selectedProductId: null,
  setSelectedProductId: (selectedProductId) => set({ selectedProductId }),
  selectedPublishProduct: null,
  setSelectedPublishProduct: (selectedPublishProduct) => set({ selectedPublishProduct }),
  selectedUtilizedProduct: null,
  setSelectedUtilizedProduct: (selectedUtilizedProduct) => set({ selectedUtilizedProduct }),
  selectedUtilizedProductId: null,
  setSelectedUtilizedProductId: (selectedUtilizedProductId) => set({ selectedUtilizedProductId }),
  entry: null,
  setEntry: (entry) => set({ entry }),
  selectedEntriesProductId: null,
  setSelectedEntriesProductId: (selectedEntriesProductId) => set({ selectedEntriesProductId }),
  selectedEntryId: null,
  setSelectedEntryId: (selectedEntryId) => set({ selectedEntryId }),
  order: emptyOrder,
  setOrder: (order) => set({ order }),
  selectedOrderId: null,
  setSelectedOrderId: (selectedOrderId) => set({ selectedOrderId }),
  expense: emptyExpense,
  setExpense: (expense) => set({ expense }),
  selectedExpenseId: null,
  setSelectedExpenseId: (selectedExpenseId) => set({ selectedExpenseId }),
  selectedCompleteOrderId: null,
  setSelectedCompleteOrderId: (selectedCompleteOrderId) => set({ selectedCompleteOrderId }),
  selectedConfirmReturnOrderId: null,
  setSelectedConfirmReturnOrderId: (selectedConfirmReturnOrderId) => set({ selectedConfirmReturnOrderId }),
}));
