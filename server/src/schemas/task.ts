import { Currency } from "@prisma/client";
import { date, InferType, mixed, number, object, string } from "yup";

export const createTaskSchema = object({
  category: string().required("Category is required"),
  name: string().required("Name is required"),
  description: string().required("Description is required"),
  startDate: date().required("Start date is required"),
  expectedHours: number().min(1).required("Expected hours is required"),
  hourlyRate: number()
    .min(0, "Hourly rate must be positive")
    .required("Hourly rate is required"),
  currency: mixed<Currency>()
    .oneOf(["USD", "AUD", "SGD", "INR"])
    .required("Currency is required"),
});

export type CreateTaskInput = InferType<typeof createTaskSchema>;
