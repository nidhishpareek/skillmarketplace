import useSWR, { mutate } from "swr";
import axios from "axios";
import { CreateSkillInput } from "@/apiCalls/skills";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useSkills = () => {
  const { data, error, isLoading } = useSWR("/api/send/skill", fetcher);

  const updateSkill = async (skillData: CreateSkillInput) => {
    try {
      const url = "/api/send/skill"; // Single endpoint for upsert logic
      const method = "post";

      await axios({
        url,
        method,
        data: skillData,
      });

      mutate("/api/send/skill"); // Revalidate the skills data
    } catch (error) {
      console.error("Error in updateSkill:", error);
      throw error;
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      await axios.delete(`/api/send/skill/${id}`);
      mutate("/api/send/skill"); // Revalidate the skills data
    } catch (error) {
      console.error("Error in deleteSkill:", error);
      throw error;
    }
  };

  return {
    skills: data,
    isLoading,
    error,
    updateSkill,
    deleteSkill, // Add deleteSkill to the returned object
  };
};
