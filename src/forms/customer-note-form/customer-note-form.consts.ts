import { z } from "zod";

export const CustomerNoteFormSchema = z.object({
  customerId: z.number(),
  note: z.string().min(1, "Note is required"),
  authorEmail: z.string(),
});

export type CustomerNoteFormValues = z.infer<typeof CustomerNoteFormSchema>;
