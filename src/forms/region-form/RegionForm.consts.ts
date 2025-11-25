import { z } from "zod";

export const RegionFormSchema = z.object({
  id: z.number().positive().optional(),
  countryName: z.string().min(1, "Country Name is required"),
  iso3CountryCode: z.string(),
  iso3NumericCode: z.string(),
  jurisdiction: z.string(),
  language: z.string(),
  regulatorName: z.string(),
  regulated: z.union([z.literal(0), z.literal(1)]),
  status: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

export type RegionFormValues = z.infer<typeof RegionFormSchema>;

export const emptyRegion: RegionFormValues = {
  countryName: "",
  iso3CountryCode: "",
  iso3NumericCode: "",
  jurisdiction: "",
  language: "",
  regulatorName: "",
  regulated: 1,
  status: 1,
};
