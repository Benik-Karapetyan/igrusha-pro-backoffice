import { z } from "zod";

export const ScannerFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
  key: z.string(),
  url: z.string(),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export type ScannerFormValues = z.infer<typeof ScannerFormSchema>;

export const emptyScanner: ScannerFormValues = {
  name: "",
  key: "",
  url: "",
  status: 1,
};
