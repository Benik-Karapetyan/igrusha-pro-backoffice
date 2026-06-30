import { z } from "zod";

export const BrandFormSchema = z.object({
  _id: z.string().optional(),
  image: z.string().min(1, "Image is required"),
  coverImage: z.string().min(1, "Cover image is required"),
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
  metaDescription: z.object({
    am: z.string().min(1, "Meta description is required"),
    ru: z.string().min(1, "Meta description is required"),
    en: z.string().min(1, "Meta description is required"),
  }),
  description: z.object({
    am: z.string().min(1, "Description is required"),
    ru: z.string().min(1, "Description is required"),
    en: z.string().min(1, "Description is required"),
  }),
});

export type BrandFormValues = z.infer<typeof BrandFormSchema>;

export const emptyBrand: BrandFormValues = {
  image: "",
  coverImage: "",
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
  metaDescription: {
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
