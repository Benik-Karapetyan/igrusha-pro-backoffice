import { z } from "zod";

const CustomerStatusSchema = z.union([z.literal(""), z.literal(1), z.literal(2), z.literal(3)]);

export const CustomerFiltersFormSchema = z.object({
  status: CustomerStatusSchema,
  kycCountry: z.string(),
  kycStatus: z.number().positive().or(z.literal("")),
  kycLevel: z.number().positive().or(z.literal("")),
  lastLoginCountry: z.string(),
  levelId: z.number().positive().or(z.literal("")),
  registrationDate: z.string().array(),
  lastLoginDate: z.string().array(),
});

export type CustomerFiltersFormValues = z.infer<typeof CustomerFiltersFormSchema>;
export type CustomerStatusValues = z.infer<typeof CustomerStatusSchema>;

export const emptyCustomerFilters: CustomerFiltersFormValues = {
  status: "",
  kycCountry: "",
  kycStatus: "",
  kycLevel: "",
  lastLoginCountry: "",
  levelId: "",
  registrationDate: [],
  lastLoginDate: [],
};

export const customerStatuses = [
  { name: "Active", id: 1 },
  { name: "Deactivated", id: 4 },
  { name: "Blocked", id: 5 },
  { name: "Permanently Deactivated", id: 6 },
  { name: "Closed", id: 8 },
];

export const kycStatuses = [
  { id: 0, name: "Not Submitted" },
  { id: 1, name: "Documents Requested" },
  { id: 3, name: "Approved" },
  { id: 4, name: "Rejected" },
  { id: 5, name: "Resubmission Requested" },
  { id: 6, name: "Requires Action" },
  { id: 7, name: "Pending" },
];

export const kycLevels = [
  { id: 0, name: "Unverified" },
  { id: 1, name: "Level 1" },
  { id: 2, name: "Level 2" },
];

export const customerFiltersColumnMapper = {
  status: 1,
  kycCountry: 2,
  kycStatus: 3,
  kycLevel: 4,
  lastLoginCountry: 5,
  levelId: 6,
};
