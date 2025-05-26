import { createTaskSchema } from "./../../../server/src/schemas/task";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { InferType } from "yup";
import { offerSchema } from "@/yupSchema/offerSchema";
import { sendServerRequest } from "@/utils/serverRequest";

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
      const response = await axios.post(
        `/api/send/tasks/${taskId}/progressLog`,
        {
          description,
        }
      );

      // Mutate the tasks API to refresh the data
      mutate("/api/send/tasks");
    } catch (error) {
      console.error("Error adding progress log:", error);
      throw error;
    }
  };

  const markTaskComplete = async (taskId: string) => {
    try {
      await axios.post(`/api/send/tasks/${taskId}/complete`);
      mutate("/api/send/tasks");
    } catch (error) {
      throw new Error("Failed to mark task as complete");
    }
  };

  const acknowledgeTask = async (
    taskId: string,
    action: "accept" | "reject"
  ) => {
    try {
      const response = await axios.post(
        `/api/send/tasks/${taskId}/acknowledge`,
        { action }
      );
      mutate("/api/send/tasks"); // Revalidate the tasks data
      return response.data;
    } catch (error) {
      console.error("Error in acknowledgeTask:", error);
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
    markTaskComplete,
    acknowledgeTask,
  };
};
