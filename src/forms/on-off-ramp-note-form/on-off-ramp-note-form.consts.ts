import { z } from "zod";

export const OnOffRampNoteFormSchema = z.object({
  orderId: z.number(),
  note: z.string().min(1, "Note is required"),
  authorEmail: z.string(),
});

export type OnOffRampNoteFormValues = z.infer<typeof OnOffRampNoteFormSchema>;
