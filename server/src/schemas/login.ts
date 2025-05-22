import * as yup from "yup";

export const loginSchema = yup.object({
  userIdentity: yup.string().email().required("User identity is required"),
  password: yup.string().required("Password is required"),
});

export type LoginInput = yup.InferType<typeof loginSchema>;
