import axios from "axios";
import * as yup from "yup";
import { InferType } from "yup";

// Added constants for type and role options
export enum UserType {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}
export enum UserRole {
  PROVIDER = "PROVIDER",
  USER = "USER",
}
export const TYPE_OPTIONS = Object.values(UserType);
export const ROLE_OPTIONS = Object.values(UserRole);

export const signupSchema = yup.object().shape({
  type: yup.mixed<UserType>().oneOf(TYPE_OPTIONS).required("Type is required"),
  role: yup.mixed<UserRole>().oneOf(ROLE_OPTIONS).required("Role is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*]/,
      "Password must contain at least one special character"
    ),
  mobileNumber: yup
    .string()
    .matches(/^\(\+\d{1,3}[- ]?)?\d{10}$/, "Invalid mobile number")
    .required("Mobile number is required"),
  address: yup.object().shape({
    streetNumber: yup.string().required("Street number is required"),
    streetName: yup.string().required("Street name is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    postcode: yup
      .string()
      .matches(/^[0-9]+$/, "Postcode must be a number")
      .test(
        "is-valid-postcode",
        "Postcode must be between 0200 and 9729",
        (value) => {
          const num = Number(value);
          return num >= 200 && num <= 9729;
        }
      )
      .required("Postcode is required"),
  }),
  companyName: yup.string().when("type", {
    is: "COMPANY",
    then: (schema) => schema.required("Company name is required"),
    otherwise: (schema) => schema.optional(),
  }),
  businessTaxNumber: yup.string().when("type", {
    is: "COMPANY",
    then: (schema) =>
      schema
        .matches(
          /^[A-Z0-9]{10}$/,
          "Business Tax Number must be 10 uppercase letters or digits"
        )
        .required("Business Tax Number is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

export type SignupFormData = InferType<typeof signupSchema>;

export const handleSignup = async (data: SignupFormData) => {
  try {
    const response = await axios.post("/api/send/profile", data);
    return response.status === 201;
  } catch (error) {
    console.error("Signup error:", error);
    return false;
  }
};
