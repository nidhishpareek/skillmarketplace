import * as yup from "yup";

export const createProgressLogSchema = yup.object({
  description: yup.string().required("Description is required"),
});
