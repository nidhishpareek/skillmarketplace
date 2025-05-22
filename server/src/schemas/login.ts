import { object, string, type InferType } from "yup";

export const loginSchema = object({
  userIdentity: string().email().required("User identity is required"),
  password: string().required("Password is required"),
});

export type LoginInput = InferType<typeof loginSchema>;
