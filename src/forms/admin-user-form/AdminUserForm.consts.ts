import { PhoneNumberUtil } from "google-libphonenumber";
import { z } from "zod";

const phoneUtil = PhoneNumberUtil.getInstance();

export const AdminUserFormSchema = z.object({
  id: z.number().positive().optional(),
  image: z.instanceof(FormData).nullable(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().nonempty("Email is required").email("Invalid email address"),
  phone: z.string().refine(
    (val) => {
      if (!val.trim()) return true;

      try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(val));
      } catch (err) {
        if (err instanceof Error) {
          return false;
        }
      }
    },
    { message: "Invalid Phone Number" }
  ),
  username: z.string(),
  address: z.string(),
  roleIds: z.number().array().min(1, "At least 1 role is required"),
  orgLevelId: z.number().positive().nullable(),
  brandId: z.number().positive().nullable(),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export type AdminUserFormValues = z.infer<typeof AdminUserFormSchema>;

export const emptyAdminUser: AdminUserFormValues = {
  image: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  username: "",
  address: "",
  roleIds: [],
  orgLevelId: null,
  brandId: null,
  status: 1,
};
