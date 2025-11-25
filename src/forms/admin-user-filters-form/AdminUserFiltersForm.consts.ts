import { z } from "zod";

const AdminUserStatusSchema = z.union([z.literal(""), z.literal(1), z.literal(2), z.literal(3)]);

export const AdminUserFiltersFormSchema = z.object({
  status: AdminUserStatusSchema,
  roles: z.string().array(),
  orgLevels: z.string().array(),
  brands: z.string().array(),
  createdDate: z.string().array(),
  modifiedDate: z.string().array(),
  lastLoginDate: z.string().array(),
});

export type AdminUserFiltersFormValues = z.infer<typeof AdminUserFiltersFormSchema>;
export type AdminUserStatusValues = z.infer<typeof AdminUserStatusSchema>;

export const emptyAdminUserFilters: AdminUserFiltersFormValues = {
  status: "",
  roles: [],
  orgLevels: [],
  brands: [],
  createdDate: [],
  modifiedDate: [],
  lastLoginDate: [],
};

export const adminUserStatuses = [
  { name: "Active", id: 1 },
  { name: "Inactive", id: 2 },
  { name: "Deleted", id: 3 },
];

export const adminUserFiltersValueMapper = {
  status: 1,
  roles: 2,
  orgLevels: 3,
  brands: 4,
};
