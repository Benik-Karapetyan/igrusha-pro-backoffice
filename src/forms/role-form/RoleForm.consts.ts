import { z } from "zod";

const RolePermissionSectionSchema = z.object({
  permissionSectionId: z.number(),
  permissionTypeIds: z.number().array(),
});

export const RoleFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  orgLevelId: z.number().or(z.literal("")).nullable(),
  rolesPermissionSections: RolePermissionSectionSchema.array().min(1, "At least 1 permission is needed"),
  userCount: z.number(),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

export type RoleFormValues = z.infer<typeof RoleFormSchema>;
export type RolePermissionSection = z.infer<typeof RolePermissionSectionSchema>;

export const emptyRole: RoleFormValues = {
  name: "",
  description: "",
  orgLevelId: null,
  rolesPermissionSections: [],
  userCount: 0,
};
