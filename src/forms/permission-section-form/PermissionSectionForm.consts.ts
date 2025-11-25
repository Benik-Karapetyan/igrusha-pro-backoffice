import { z } from "zod";

export const PermissionSectionFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
  permissionIds: z.number().array().min(1, "At least 1 permission is required"),
  parentId: z.number().positive("Parent Section is required"),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export type PermissionSectionFormValues = z.infer<typeof PermissionSectionFormSchema>;

export const emptyPermissionSection: PermissionSectionFormValues = {
  name: "",
  permissionIds: [],
  parentId: 0,
  status: 1,
};
