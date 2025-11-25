import { z } from "zod";

const CommentSchema = z.object({
  id: z.number(),
  comment: z.string().min(1, "Comment is required"),
});

export const AuditLogFormSchema = z.object({
  reason: z.number().positive("Reason is required"),
  jiraLink: z.string(),
  comment: CommentSchema,
});

export const AuditLogRequestSchema = AuditLogFormSchema.omit({ comment: true }).extend({
  comments: z.array(CommentSchema),
});

export type AuditLogFormValues = z.infer<typeof AuditLogFormSchema>;
export type AuditLogRequestValues = z.infer<typeof AuditLogRequestSchema>;

export const emptyAuditLog: AuditLogFormValues = {
  reason: 0,
  jiraLink: "",
  comment: {
    id: 0,
    comment: "",
  },
};
