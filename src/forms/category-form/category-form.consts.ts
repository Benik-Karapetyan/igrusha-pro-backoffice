import { ENUM_CATEGORY_TYPE } from "@types";
import { z } from "zod";

export const CategoryFormSchema = z.object({
  _id: z.string().optional(),
  type: z.nativeEnum(ENUM_CATEGORY_TYPE).array().min(1, "At least 1 type is required"),
  urlName: z.string().min(1, "URL name is required"),
  name: z.object({
    am: z.string().min(1, "Name is required"),
    ru: z.string().min(1, "Name is required"),
    en: z.string().min(1, "Name is required"),
  }),
  title: z.object({
    am: z.string().min(1, "Title is required"),
    ru: z.string().min(1, "Title is required"),
    en: z.string().min(1, "Title is required"),
  }),
  description: z.object({
    am: z.string().min(1, "Description is required"),
    ru: z.string().min(1, "Description is required"),
    en: z.string().min(1, "Description is required"),
  }),
});

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;

export const emptyCategory: CategoryFormValues = {
  type: [],
  urlName: "",
  name: {
    am: "",
    ru: "",
    en: "",
  },
  title: {
    am: "",
    ru: "",
    en: "",
  },
  description: {
    am: "",
    ru: "",
    en: "",
  },
};

export const categoryTypes = [
  { name: "Games And Toys", id: ENUM_CATEGORY_TYPE.GamesAndToys },
  { name: "Baby", id: ENUM_CATEGORY_TYPE.Baby },
  { name: "Boy", id: ENUM_CATEGORY_TYPE.Boy },
  { name: "Girl", id: ENUM_CATEGORY_TYPE.Girl },
  { name: "ForHappiestDays", id: ENUM_CATEGORY_TYPE.ForHappiestDays },
];
