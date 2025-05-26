import * as yup from "yup";

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  INR = "INR",
}

export const CurrencyOptions = Object.values(Currency);

export const offerSchema = yup.object().shape({
  hourlyRate: yup
    .number()
    .min(1, "Hourly rate must be at least 1")
    .required("Hourly rate is required"),
  startDate: yup.date().required("Start date is required"),
  expectedHours: yup
    .number()
    .min(1, "Expected hours must be at least 1")
    .required("Expected hours are required"),
  currency: yup
    .string()
    .oneOf(CurrencyOptions, "Invalid currency")
    .required("Currency is required"),
});
