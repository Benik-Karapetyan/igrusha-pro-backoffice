import { z } from "zod";

export const CustomerVipLevelFormSchema = z.object({
  levelId: z.number(),
  note: z.string(),
});

export type CustomerVipLevelFormValues = z.infer<typeof CustomerVipLevelFormSchema>;

export const emptyCustomerVipLevel: CustomerVipLevelFormValues = {
  levelId: 0,
  note: "",
};
