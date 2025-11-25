import { z } from "zod";

export const AlertApproveRejectFormSchema = z.object({
  notes: z.string().min(1, "Notes is required"),
});

export type AlertApproveRejectFormValues = z.infer<typeof AlertApproveRejectFormSchema>;
