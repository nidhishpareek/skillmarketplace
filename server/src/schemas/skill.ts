import { Currency, WorkNature } from "@prisma/client";
import { InferType, mixed, number, object, string } from "yup";

export const createSkillSchema = object({
  id: string().nullable(), // Allow nullable id for upsert
  category: string().required("Category is required"),
  experience: string().required("Experience is required"),
  nature: mixed<WorkNature>()
    .oneOf(["ONLINE", "ONSITE"])
    .required("Nature is required"),
  hourlyRate: number()
    .min(0, "Hourly rate must be positive")
    .required("Hourly rate is required"),
  currency: mixed<Currency>()
    .oneOf(Object.values(Currency))
    .required("Currency is required"),
});

export type CreateSkillInput = InferType<typeof createSkillSchema>;
