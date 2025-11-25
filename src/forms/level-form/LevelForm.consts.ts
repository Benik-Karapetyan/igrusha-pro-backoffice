import { z } from "zod";

const LevelTypeSchema = z.union([z.literal(1), z.literal(2)]);

export const LevelFormSchema = z.object({
  id: z.number().positive().optional(),
  name: z.string().min(1, "Name is required"),
  type: LevelTypeSchema,
  isDefault: z.union([z.literal(0), z.literal(1)]),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

export type LevelFormValues = z.infer<typeof LevelFormSchema>;
export type LevelTypeValues = z.infer<typeof LevelTypeSchema>;

export const emptyLevel: LevelFormValues = {
  name: "",
  type: 1,
  isDefault: 0,
};

export const levelTypes = [
  { name: "Level", id: 1 },
  { name: "Custom", id: 2 },
];
