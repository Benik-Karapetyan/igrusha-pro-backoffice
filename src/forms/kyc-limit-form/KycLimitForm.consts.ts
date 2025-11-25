import { z } from "zod";

export const KycLimitFormSchema = z.object({
  id: z.number().positive().optional(),
  locationId: z.number().positive().or(z.string().min(1, "Country is required")),
  kycLevelId: z.number().positive().or(z.string().min(1, "KYC Level is required")),
  productId: z.number().positive().or(z.string().min(1, "Product is required")),
  dailyLimit: z
    .number()
    .positive("Min value must be greater than or equal to 0")
    .or(z.literal(0))
    .or(z.string().min(1, "Daily Limit is required")),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

export type KycLimitFormValues = z.infer<typeof KycLimitFormSchema>;

export const emptyKycLimit: KycLimitFormValues = {
  locationId: "",
  kycLevelId: "",
  productId: "",
  dailyLimit: "",
};
