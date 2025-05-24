import axios from "axios";
import { InferType, object, string } from "yup";

export const loginSchema = object().shape({
  userIdentity: string()
    .test(
      "is-email-or-mobile",
      "User identity must be a valid email or mobile number",
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        return emailRegex.test(value || "") || mobileRegex.test(value || "");
      }
    )
    .required("User identity is required"),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),
});

export const handleLogin = async (data: InferType<typeof loginSchema>) => {
  try {
    const response = await axios.post("/api/send/login", data);
    return response.status === 200;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};
