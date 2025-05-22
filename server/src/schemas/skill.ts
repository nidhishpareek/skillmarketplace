import { WorkNature } from "@prisma/client";
import { InferType, mixed, number, object, string } from "yup";

export const createSkillSchema = object({
  category: string().required("Category is required"),
  experience: string().required("Experience is required"),
  nature: mixed<WorkNature>()
    .oneOf(["ONLINE", "ONSITE"])
    .required("Nature is required"),
  hourlyRate: number()
    .min(0, "Hourly rate must be positive")
    .required("Hourly rate is required"),
});

export type CreateSkillInput = InferType<typeof createSkillSchema>;
