import { TaskCategory } from "@prisma/client";
import { date, InferType, mixed, number, object, string } from "yup";

export const createTaskSchema = object({
  category: mixed<TaskCategory>()
    .oneOf(Object.values(TaskCategory))
    .required("Category is required"),
  name: string().required("Name is required"),
  description: string().required("Description is required"),
});

export type CreateTaskInput = InferType<typeof createTaskSchema>;
