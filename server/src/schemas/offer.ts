import { object, string, number, mixed, InferType } from "yup";
import { Currency } from "@prisma/client";

export const createOfferSchema = object({
  hourlyRate: number().required("Hourly rate is required"),
  startDate: string().required("Start date is required"),
  expectedHours: number().required("Expected hours are required"),
  currency: mixed<Currency>()
    .oneOf(Object.values(Currency))
    .required("Currency is required"),
  taskId: string().required("Task ID is required"),
});

export type CreateOfferInput = InferType<typeof createOfferSchema>;
