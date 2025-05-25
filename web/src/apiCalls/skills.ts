import axios from "axios";
import { InferType, mixed, number, object, string } from "yup";

export const WorkNature = ["ONLINE", "ONSITE"] as const;
export const Currency = ["USD", "AUD", "SGD", "INR"] as const;

export const createSkillSchema = object({
  id: string().nullable(), // Allow nullable id for upsert
  category: string().required("Category is required"),
  experience: string().required("Experience is required"),
  nature: string().oneOf(WorkNature).required("Nature is required"),
  hourlyRate: number()
    .min(0, "Hourly rate must be positive")
    .required("Hourly rate is required"),
  currency: string()
    .oneOf(Object.values(Currency))
    .required("Currency is required"),
});

export type CreateSkillInput = InferType<typeof createSkillSchema>;

export const createOrUpdateSkill = async (skillData: any, skillId?: string) => {
  const url = skillId ? `/api/skill/${skillId}` : "/api/skill";
  const method = skillId ? "put" : "post";

  try {
    const response = await axios({
      url,
      method,
      data: skillData,
    });
    return response.data;
  } catch (error) {
    console.error("Error in createOrUpdateSkill:", error);
    throw error;
  }
};
