import * as yup from "yup";

export const acknowledgeTaskSchema = yup.object({
  action: yup
    .string()
    .oneOf(["accept", "reject"], "Action must be either 'accept' or 'reject'")
    .required("Action is required"),
});
