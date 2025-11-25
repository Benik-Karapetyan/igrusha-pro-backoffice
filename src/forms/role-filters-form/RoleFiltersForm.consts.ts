import { z } from "zod";

const RoleStatusSchema = z.union([z.literal(""), z.literal(1), z.literal(2), z.literal(3)]);

export const RoleFiltersFormSchema = z.object({
  status: RoleStatusSchema,
  createdDate: z.string().array(),
  modifiedDate: z.string().array(),
  modifiedBy: z.string(),
  userCountMin: z.number().or(z.literal("")),
  userCountMax: z.number().or(z.literal("")),
});

export type RoleFiltersFormValues = z.infer<typeof RoleFiltersFormSchema>;
export type RoleStatusValues = z.infer<typeof RoleStatusSchema>;

export const emptyRoleFilters: RoleFiltersFormValues = {
  status: "",
  createdDate: [],
  modifiedDate: [],
  modifiedBy: "",
  userCountMin: "",
  userCountMax: "",
};

export const roleStatuses = [
  { name: "Active", id: 1 },
  { name: "Inactive", id: 2 },
  { name: "Deleted", id: 3 },
];

export const roleFiltersValueMapper = {
  status: 1,
  modifiedBy: 2,
};
