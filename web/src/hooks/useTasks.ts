import { createTaskSchema } from "./../../../server/src/schemas/task";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { InferType } from "yup";
import { offerSchema } from "@/yupSchema/offerSchema";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useTasks = () => {
  const { data, error, isLoading } = useSWR("/api/send/tasks", fetcher);

  const updateTask = async (taskData: InferType<typeof createTaskSchema>) => {
    try {
      await axios.post("/api/send/tasks", taskData);
      mutate("/api/send/tasks"); // Revalidate the tasks data
    } catch (error) {
      console.error("Error in updateTask:", error);
      throw error;
    }
  };

  const createOffer = async (
    taskId: string,
    offerData: InferType<typeof offerSchema>
  ) => {
    try {
      await axios.post(`/api/send/tasks/${taskId}/offer`, offerData);
      mutate("/api/send/tasks"); // Revalidate the tasks data
    } catch (error) {
      console.error("Error in createOffer:", error);
      throw error;
    }
  };

  const acceptOffer = async (taskId: string, offerId: string) => {
    try {
      await axios.post(`/api/send/tasks/${taskId}/offer/${offerId}/accept`);
      mutate("/api/send/tasks"); // Revalidate the tasks data
    } catch (error) {
      console.error("Error in acceptOffer:", error);
      throw error;
    }
  };

  const addProgressLog = async (taskId: string, description: string) => {
    try {
      const response = await fetch(`/api/send/tasks/${taskId}/progressLog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error("Failed to add progress log");
      }

      // Mutate the tasks API to refresh the data
      mutate("/api/tasks");
    } catch (error) {
      console.error("Error adding progress log:", error);
      throw error;
    }
  };

  return {
    tasks: data,
    isLoading,
    error,
    updateTask,
    createOffer, // Add createOffer to the returned object
    acceptOffer, // Add acceptOffer to the returned object
    addProgressLog,
  };
};
