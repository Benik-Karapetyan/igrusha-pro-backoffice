import { z } from "zod";

export const OrgLevelFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
});

export type OrgLevelFormValues = z.infer<typeof OrgLevelFormSchema>;

export const emptyOrgLevel: OrgLevelFormValues = {
  name: "",
};
